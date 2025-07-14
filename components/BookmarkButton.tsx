import { useFavorites } from "@/components/FavoritesContext";
import { db } from '@/configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Daha güvenli ve esnek bir tip tanımı
interface Book {
  id: string;
  title: string;
  author?: string;
  authors?: string[]; // Çoklu yazar desteği eklendi
  coverUrl?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  language?: string;
}

// book prop'unun tipini Book olarak güncelledim
const BookmarkButton = ({ book }: { book: Book }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { favorites, setFavorites } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && book?.id) {
      checkIfFavorite();
    }
  }, [isLoaded, isSignedIn, user?.id, book?.id]);

  // 📌 Bu kitap favorilere eklenmiş mi kontrol et
  const checkIfFavorite = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user?.id || !book?.id) return; // Hatalı çağrıyı engelle
      const docRef = doc(db, "Favorites", user.id, "books", book.id);
      const docSnap = await getDoc(docRef);
      setIsFavorite(docSnap.exists());
    } catch (error) {
      console.error('Kontrol hatası:', error);
    }
  };

  // ✅ Favoriye ekle
  const addToFavorites = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user?.id || !book?.id) return; // Hatalı çağrıyı engelle
      await setDoc(doc(db, "Favorites", user.id, "books", book.id), {
        title: book.title,
        author: book.author ?? (book.authors ? book.authors.join(', ') : '') ?? "",
        coverUrl: book.coverUrl || "",
        publishedDate: book.publishedDate || "",
        pageCount: book.pageCount || 0,
        language: book.language || "",
        description: book.description || "",
        addedAt: new Date(),
        addedBy: user?.fullName || "", // Kullanıcı adı yoksa boş string
        userId: user?.id
      });
      setIsFavorite(true);
      Alert.alert("Başarılı", "Kitap favorilere eklendi!");
      setFavorites((prev: string[]) => [...prev, book.id]); // Context'i güncelle
    } catch (error) {
      console.error('Favoriye ekleme hatası:', error);
    }
  };

  // ❌ Favoriden çıkar
  const removeFromFavorites = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user?.id || !book?.id) return; // Hatalı çağrıyı engelle
      await deleteDoc(doc(db, "Favorites", user.id, "books", book.id));
      setIsFavorite(false);
      Alert.alert("Başarılı", "Kitap favorilerden çıkarıldı!");
      setFavorites((prev: string[]) => prev.filter((id: string) => id !== book.id)); // Context'i güncelle
    } catch (error) {
      console.error('Favoriden çıkarma hatası:', error);
    }
  };

  // 🔁 Toggle fonksiyonu
  const toggleFavorite = () => {
    if (!isLoaded || !isSignedIn || !user?.id || !book?.id) {
      Alert.alert("Giriş yapmalısınız", "Favorilere eklemek için giriş yapın.");
      return;
    }
    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };

  // Kullanıcı verisi yüklenmeden veya giriş yapılmadan butonu gösterme
  if (!isLoaded || !isSignedIn || !user || !user.id) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      {isFavorite ? (
        // Eğer ikon bulunamazsa hata olmaması için fallback ekledim
        <Image source={require("@/assets/icons/checked-bookmark.png")}
               style={styles.icon}
               resizeMode="contain"
               defaultSource={require("@/assets/icons/unchecked-bookmark.png")} // fallback
        />
      ) : (
        <Image source={require("@/assets/icons/unchecked-bookmark.png")}
               style={styles.icon}
               resizeMode="contain"
               defaultSource={require("@/assets/icons/checked-bookmark.png")} // fallback
        />
      )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});