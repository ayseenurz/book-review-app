import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";


export interface FavoriteBook {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string;
  publishedDate?: string;
}

// Favori yazar tipi
type FavoriteAuthor = {
  id: string;
  name: string;
  birth_date?: string;
  top_work?: string;
  work_count?: number;
};

interface FavoritesContextType {
  favorites: Record<string, FavoriteBook>;
  setFavorites: React.Dispatch<React.SetStateAction<Record<string, FavoriteBook>>>;
  favoritesCounts: Record<string, number>;
  setFavoritesCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  favoriteAuthors: Record<string, FavoriteAuthor>;
  setFavoriteAuthors: React.Dispatch<React.SetStateAction<Record<string, FavoriteAuthor>>>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Record<string, FavoriteBook>>({});
  const [favoritesCounts, setFavoritesCounts] = useState<Record<string, number>>({});
  const [favoriteAuthors, setFavoriteAuthors] = useState<Record<string, FavoriteAuthor>>({});

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) return;

      try {
        const querySnapshot = await getDocs(collection(db, "Favorites", user.id, "books"));
        const favs: Record<string, FavoriteBook> = {};
        const counts: Record<string, number> = {};

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const bookId = docSnap.id;

          favs[bookId] = {
            id: bookId,
            title: data.title,
            author: typeof data.author === 'string'
              ? data.author
              : Array.isArray(data.author)
                ? data.author.join(', ')
                : '',
            thumbnail: data.coverUrl ?? "",
            publishedDate: data.publishedDate ?? "",
          };

          const bookRef = doc(db, "books", bookId);
          const bookDoc = await getDoc(bookRef);
          if (bookDoc.exists()) {
            counts[bookId] = bookDoc.data().favoritesCount || 0;
          } else {
            counts[bookId] = 0;
          }
        }

        setFavorites(favs);
        setFavoritesCounts(counts);
      } catch (error) {
        console.error("Favoriler yüklenirken hata:", error);
      }
    };

    fetchFavorites();
  }, [isLoaded, isSignedIn, user?.id]);

  // Favori yazarları Firestore'dan çek
  useEffect(() => {
    const fetchFavoriteAuthors = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) return;
      try {
        const querySnapshot = await getDocs(collection(db, "Favorites", user.id, "authors"));
        const favAuthors: Record<string, FavoriteAuthor> = {};
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const authorId = docSnap.id;
          favAuthors[authorId] = {
            id: authorId,
            name: data.name,
            birth_date: data.birth_date ?? "",
            top_work: data.top_work ?? "",
            work_count: data.work_count ?? 0,
          };
        }
        setFavoriteAuthors(favAuthors);
      } catch (error) {
        console.error("Favori yazarlar yüklenirken hata:", error);
      }
    };
    fetchFavoriteAuthors();
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, favoritesCounts, setFavoritesCounts, favoriteAuthors, setFavoriteAuthors }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
