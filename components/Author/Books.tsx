import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookListCard from './BookListCard';
import { router } from 'expo-router';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

const Books = ({ authorName }: { authorName: string }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorName) return;
    setLoading(true);
    setError(null);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:"${authorName}"&maxResults=10`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Kitaplar yüklenemedi.');
        setLoading(false);
      });
  }, [authorName]);

  if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.booksContainer}>
      <Text style={styles.title}>Yazarın Kitapları</Text>
      {books.length > 0 ? (
        <FlatList
          data={books}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/book-detail/${item.id}`)}>
              <BookListCard book={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingRight: 16 }}
        />
      ) : (
        <Text style={styles.bookText}>Kitap bulunamadı.</Text>
      )}
    </View>
  );
}

export default Books;

const styles = StyleSheet.create({
  booksContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 16,
    color: '#6c584c',
  },
  bookText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});
