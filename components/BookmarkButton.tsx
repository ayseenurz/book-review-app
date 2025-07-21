import { useFavorites } from "@/components/FavoritesContext";
import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import { deleteDoc, doc, increment, setDoc } from "firebase/firestore";
import React, { useRef } from "react";
import { Alert, Animated, StyleSheet, TouchableOpacity } from "react-native";

interface Book {
  id: string;
  title: string;
  author?: string;
  authors?: string[];
  coverUrl?: string;
  publishedDate?: string;
}

interface Author {
  id: string;
  name: string;
  birth_date?: string;
  top_work?: string;
  work_count?: number;
}

type BookmarkButtonProps = {
  type: "book" | "author";
  item: Book | Author;
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ type, item }) => {
  if (!item) return null;
  const { user, isSignedIn, isLoaded } = useUser();
  const { favorites, setFavorites, favoriteAuthors, setFavoriteAuthors } =
    useFavorites();

  const isFavorite =
    type === "book" ? !!favorites[item.id] : !!favoriteAuthors[item.id];

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addToFavorites = async () => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (type === "book") {
        const book = item as Book;
        // Önce kullanıcının bu kitabı favoriye ekleyip eklemediğini kontrol et
        const favDocRef = doc(db, "Favorites", user.id, "books", book.id);
        const favDocSnap = await import("firebase/firestore").then((m) =>
          m.getDoc(favDocRef)
        );
        const isAlreadyFavorite = favDocSnap.exists();
        await setDoc(favDocRef, {
          title: book.title,
          author:
            typeof book.author === "string"
              ? book.author
              : Array.isArray(book.authors)
              ? book.authors.join(", ")
              : "",
          coverUrl: book.coverUrl ?? "",
          publishedDate: book.publishedDate ?? "",
          addedAt: new Date(),
          addedBy: user.fullName ?? "",
          userId: user.id,
        });

        if (!isAlreadyFavorite) {
          const countRef = doc(db, "BookFavoritesCount", book.id);
          await setDoc(countRef, { count: increment(1) }, { merge: true });
        }
        setFavorites((prev) => ({
          ...prev,
          [book.id]: {
            id: book.id,
            title: book.title,
            author:
              typeof book.author === "string"
                ? book.author
                : Array.isArray(book.authors)
                ? book.authors.join(", ")
                : "",
            thumbnail: book.coverUrl ?? "",
            publishedDate: book.publishedDate ?? "",
          },
        }));
      } else if (type === "author") {
        const author = item as Author;

        const safeAuthor = {
          name: typeof author.name === "string" ? author.name : "",
          birth_date:
            typeof author.birth_date === "string" ? author.birth_date : "",
          top_work: typeof author.top_work === "string" ? author.top_work : "",
          work_count:
            typeof author.work_count === "number" ? author.work_count : 0,
          addedAt: new Date(),
          addedBy: user.fullName ?? "",
          userId: user.id,
        };

        if (!user?.id) {
          console.error("user.id undefined!");
          Alert.alert("Hata", "Kullanıcı ID'si bulunamadı.");
          return;
        }
        if (!author?.id) {
          console.error("author.id undefined!");
          Alert.alert("Hata", "Yazar ID'si bulunamadı.");
          return;
        }
        if (!db) {
          console.error("db undefined!");
          Alert.alert("Hata", "Firestore bağlantısı yok.");
          return;
        }
        console.log(
          "Firestore path:",
          `Favorites/${user.id}/authors/${author.id}`
        );
        console.log("author ekleniyor:", safeAuthor);
        await setDoc(
          doc(db, "Favorites", user.id, "authors", author.id),
          safeAuthor
        );
        setFavoriteAuthors((prev) => ({
          ...prev,
          [author.id]: {
            id: author.id,
            name: safeAuthor.name,
            birth_date: safeAuthor.birth_date,
            top_work: safeAuthor.top_work,
            work_count: safeAuthor.work_count,
          },
        }));
      }
    } catch (error) {
      console.error("Favoriye ekleme hatası:", error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!isLoaded || !isSignedIn || !user?.id || !item?.id) return;
      if (type === "book") {
        await deleteDoc(doc(db, "Favorites", user.id, "books", item.id));

        const countRef = doc(db, "BookFavoritesCount", item.id);
        const countSnap = await import("firebase/firestore").then((m) =>
          m.getDoc(countRef)
        );
        const currentCount = countSnap.exists()
          ? countSnap.data().count || 0
          : 0;
        if (currentCount > 0) {
          await setDoc(countRef, { count: increment(-1) }, { merge: true });
        }
        setFavorites((prev) => {
          const copy = { ...prev };
          delete copy[item.id];
          return copy;
        });
      } else if (type === "author") {
        await deleteDoc(doc(db, "Favorites", user.id, "authors", item.id));
        setFavoriteAuthors((prev) => {
          const copy = { ...prev };
          delete copy[item.id];
          return copy;
        });
      }
    } catch (error) {
      console.error("Favoriden çıkarma hatası:", error);
    }
  };

  const toggleFavorite = () => {
    animate();
    if (!isLoaded || !isSignedIn || !user?.id) {
      Alert.alert("Giriş yapmalısınız", "Favorilere eklemek için giriş yapın.");
      return;
    }
    isFavorite ? removeFromFavorites() : addToFavorites();
  };

  if (!isLoaded || !isSignedIn || !user?.id) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite} style={styles.button}>
      <Animated.Image
        source={
          isFavorite
            ? require("@/assets/icons/checked-bookmark.png")
            : require("@/assets/icons/unchecked-bookmark.png")
        }
        style={[styles.icon, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: { width: 24, height: 24 },
  button: { marginLeft: 8 },
});

export default BookmarkButton;
