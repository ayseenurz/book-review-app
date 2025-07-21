import SuggestedBooksCard from '@/components/Home/SuggestedBooks/SuggestedBooksCard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SuggestedBooksAll = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://www.googleapis.com/books/v1/volumes?q=fiction&orderBy=newest&printType=books&maxResults=40'
        );
        const data = await res.json();
        setBooks(data.items || []);
      } catch (e) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('@/assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Okuman Gerekenler</Text>
      </View>
      {loading ? (
        <Text style={styles.loading}>Yükleniyor...</Text>
      ) : books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Kitap bulunamadı.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <SuggestedBooksCard {...{
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail,
            publishedDate: item.volumeInfo.publishedDate,
          }} fullWidth />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF9',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#f2eee9',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#6B4F27',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c584c',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
    fontStyle: 'italic',
  },
  loading: {
    color: '#6c584c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default SuggestedBooksAll;