import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  return (
    <View>
      <Text>BookmarkList</Text>
    </View>
  )
}

export default BookmarkList

const styles = StyleSheet.create({})