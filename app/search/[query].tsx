import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSearchResults } from '../../components/SearchResultsContext';
import BookListCard from '../BookList/BookListCard';


const Search = () => {
  const params = useLocalSearchParams();
  const query = typeof params.query === 'string' ? params.query : Array.isArray(params.query) ? params.query[0] : '';
  const { results, setResults } = useSearchResults();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    let apiQuery = query;
    if (query.startsWith('author:')) {
      const authorName = query.replace('author:', '').trim();
      apiQuery = `inauthor:${encodeURIComponent(authorName)}`;
    }
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${apiQuery}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Bir hata oluştu.');
        setLoading(false);
      });
  }, [query, setResults]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;
  if (error) return <Text style={{ color: 'red', marginTop: 32 }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookListCard book={item} fullWidth />
        )}
        ListEmptyComponent={<Text>Sonuç bulunamadı.</Text>}
      />
    </View>
  );
}

export default Search

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});