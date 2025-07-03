import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import BookmarkListCard from './BookmarkListCard';

const BOOKMARKS_KEY = 'BOOKMARKED_BOOKS';

const addToBookmarks = async (book: any) => {
  try {
    const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
    let bookmarks = json ? JSON.parse(json) : [];
    // Aynı kitap tekrar eklenmesin
    if (!bookmarks.some((b: any) => b.id === book.id)) {
      bookmarks.push(book);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (e) {
    // Hata yönetimi
  }
};

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);
      try {
        const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
        setBookmarks(json ? JSON.parse(json) : []);
      } catch (e) {
        setBookmarks([]);
      }
      setLoading(false);
    };
    loadBookmarks();
  }, []);

  if (loading) {
    return <Text style={styles.loading}>Yükleniyor...</Text>;
  }

  if (!bookmarks.length) {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../assets/icons/bookmark.png')} style={styles.emptyIcon} />
        <Text style={styles.emptyText}>Henüz hiç kitap kaydetmediniz.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <BookmarkListCard book={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default BookmarkList;

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  loading: {
    marginTop: 32,
    textAlign: 'center',
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    opacity: 0.2,
    marginBottom: 12,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});