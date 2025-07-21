// hooks/useRecentlyViewedBooks.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_VIEWED_KEY = 'recently_viewed_books';

export const addRecentlyViewedBook = async (bookId: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    let ids = jsonValue ? JSON.parse(jsonValue) : [];
    // Aynı kitap varsa çıkar
    ids = ids.filter((id: string) => id !== bookId);
    // En başa ekle
    ids.unshift(bookId);
    // 10 ile sınırla
    ids = ids.slice(0, 10);
    await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
  } catch (e) {
    // Hata yönetimi
  }
};

export const getRecentlyViewedBooks = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};
