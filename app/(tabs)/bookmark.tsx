import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BookListCard from '../BookList/BookListCard';
import { useFocusEffect } from 'expo-router';
import { db } from '@/configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs } from 'firebase/firestore';

// Firestore'dan kullanıcının favori kitap id'lerini çekip, Google Books API'dan kitap detaylarını getir

const Bookmark = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [bookDetails, setBookDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore'dan favori kitap id'lerini çek
  const fetchFavoriteBookIds = async (): Promise<string[]> => {
    if (!isLoaded || !isSignedIn || !user?.id) return [];
    try {
      const snap = await getDocs(collection(db, "Favorites", user.id, "books"));
      return snap.docs.map(doc => doc.id);
    } catch (e) {
      return [];
    }
  };

  // Google Books API'dan kitap detaylarını çek
  const fetchBookDetails = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setBookDetails([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Google Books API'dan kitapları sırayla çek (çok fazla kitap varsa optimize edilebilir)
      const results: any[] = [];
      for (const id of ids) {
        try {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
          const data = await res.json();
          if (data && data.id && data.volumeInfo) {
            results.push(data);
          }
        } catch (err) {
          // Hatalı kitap atlanır
        }
      }
      setBookDetails(results);
    } catch (e) {
      setBookDetails([]);
    }
    setLoading(false);
  };

  // Sayfa her odaklandığında Firestore'dan güncel favori kitapları çek
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        setLoading(true);
        const ids = await fetchFavoriteBookIds();
        if (isActive) {
          await fetchBookDetails(ids);
        }
      };
      load();
      return () => { isActive = false; };
    }, [isLoaded, isSignedIn, user?.id])
  );

  // İlk açılışta da yükle (ekstra güvence)
  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setLoading(true);
      const ids = await fetchFavoriteBookIds();
      if (isActive) {
        await fetchBookDetails(ids);
      }
    };
    load();
    return () => { isActive = false; };
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Favori Kitaplarım</Text>
      {!isLoaded || !isSignedIn ? (
        <Text style={{ marginTop: 32, color: '#888' }}>Favori kitaplarınızı görmek için giriş yapmalısınız.</Text>
      ) : loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" />
      ) : bookDetails.length === 0 ? (
        <Text style={{ marginTop: 32, color: '#888' }}>Henüz favorilere kitap eklemediniz.</Text>
      ) : (
        <FlatList
          data={bookDetails}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BookListCard book={item} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
});

export default Bookmark;