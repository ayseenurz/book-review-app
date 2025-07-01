import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import BookListCard from '../BookList/BookListCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// Favori kitaplar için context oluşturalım ve sayfalar arası geçişte güncel tutalım
// Ancak burada context yoksa, en azından AsyncStorage ile güncel veri çekimini garanti altına alalım

const BOOKMARKS_KEY = 'BOOKMARKED_BOOKS';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AsyncStorage'dan favorileri çek ve BookListCard'ın beklediği formata dönüştür
  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (json) {
        let parsed = JSON.parse(json);
        // Eğer sadece volumeInfo saklanıyorsa, id ekle
        if (Array.isArray(parsed)) {
          parsed = parsed.map((item) => {
            // Eğer item.id yoksa, item.volumeInfo.id veya başka bir id ekle
            if (!item.id && item.volumeInfo && item.volumeInfo.industryIdentifiers) {
              // Google Books API'dan gelen id yoksa, ISBN'den türet
              const isbn = item.volumeInfo.industryIdentifiers?.[0]?.identifier;
              return { ...item, id: isbn || Math.random().toString(36).slice(2) };
            }
            return item;
          });
        }
        setBookmarks(parsed);
      } else {
        setBookmarks([]);
      }
    } catch (e) {
      setBookmarks([]);
    }
    setLoading(false);
  };

  // Sayfa her odaklandığında bookmark'ları güncelle
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  // İlk açılışta da yükle (ekstra güvence)
  useEffect(() => {
    loadBookmarks();
  }, []);

  // DEBUG: Favoriler güncellendiğinde logla
  useEffect(() => {
    console.log('Bookmark sayfası bookmarks:', bookmarks);
  }, [bookmarks]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Favori Kitaplarım</Text>
      {loading ? (
        <Text style={{ marginTop: 32 }}>Yükleniyor...</Text>
      ) : bookmarks.length === 0 ? (
        <Text style={{ marginTop: 32, color: '#888' }}>Henüz favorilere kitap eklemediniz.</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BookListCard book={item} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
});

export default Bookmark;