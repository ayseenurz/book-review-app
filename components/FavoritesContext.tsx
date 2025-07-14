import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

type FavoriteBook = {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
  publishedDate: string | null;
};

const FavoritesContext = createContext<{
  favorites: FavoriteBook[];
}>({
  favorites: [],
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setFavorites([]); // kullanıcı yoksa temizle
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'Favorites', user.id, 'books'),
      (snapshot) => {
        const favs = snapshot.docs.map(doc => doc.data() as FavoriteBook);
        setFavorites(favs);
      },
      (error) => {
        console.error('Favoriler okunamadı:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  return (
    <FavoritesContext.Provider value={{ favorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
