import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig";

// Güvenli veri hazırlama fonksiyonu
function prepareFavoriteBook(book: any) {
  const volume = book?.volumeInfo || {};
  return {
    id: book.id ?? "unknown",
    title: volume.title ?? "Başlıksız Kitap",
    author: Array.isArray(volume.authors) && volume.authors.length > 0
      ? volume.authors[0]
      : "Bilinmeyen Yazar",
    thumbnail: volume.imageLinks?.thumbnail ?? null,
    publishedDate: volume.publishedDate ?? null,
  };
}

// Favoriye ekleme
export async function addToFavorites(userId: string, book: any) {
  const favoriteBook = prepareFavoriteBook(book);

  await setDoc(
    doc(db, "Favorites", userId, "books", favoriteBook.id),
    favoriteBook
  );
}

// Favoriden çıkarma
export async function removeFromFavorites(userId: string, bookId: string) {
  await deleteDoc(doc(db, "Favorites", userId, "books", bookId));
}
