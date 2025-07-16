import { useFavorites } from "@/components/FavoritesContext";
import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import React from "react";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Book {
  id: string;
  title: string;
  author?: string;
  authors?: string[];
  coverUrl?: string;
  publishedDate?: string;
}

const BookmarkButton: React.FC<{ book: Book }> = ({ book }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { favorites, setFavorites } = useFavorites();

  const isFavorite = !!favorites[book.id];

  const addToFavorites = async () => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    try {
      await setDoc(doc(db, "Favorites", user.id, "books", book.id), {
        title: book.title,
        author: book.author ?? (book.authors?.join(", ") ?? ""),
        coverUrl: book.coverUrl ?? "",
        publishedDate: book.publishedDate ?? "",
        addedAt: new Date(),
        addedBy: user.fullName ?? "",
        userId: user.id,
      });
      setFavorites((prev) => ({
        ...prev,
        [book.id]: {
          id: book.id,
          title: book.title,
          author: book.author ?? (book.authors?.join(", ") ?? ""),
          thumbnail: book.coverUrl ?? "",
          publishedDate: book.publishedDate ?? "",
        }
      }));
    } catch (error) {
      console.error("Favoriye ekleme hatası:", error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user?.id || !book?.id) return; 
      await deleteDoc(doc(db, "Favorites", user.id, "books", book.id));
      setFavorites((prev) => {
        const copy = { ...prev };
        delete copy[book.id];
        return copy;
      });
    } catch (error) {
      console.error('Favoriden çıkarma hatası:', error);
    }
  };

  const toggleFavorite = () => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      Alert.alert("Giriş yapmalısınız", "Favorilere eklemek için giriş yapın.");
      return;
    }
    isFavorite ? removeFromFavorites() : addToFavorites();
  };

  if (!isLoaded || !isSignedIn || !user?.id) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Image
        source={
          isFavorite
            ? require("@/assets/icons/checked-bookmark.png")
            : require("@/assets/icons/unchecked-bookmark.png")
        }
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: { width: 24, height: 24 },
});

export default BookmarkButton;
