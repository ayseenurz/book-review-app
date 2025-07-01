import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSearchResults } from '../../components/SearchResultsContext';
import BookListCard from '../BookList/BookListCard';

const Explore = () => {
  const router = useRouter();
  const { results, setResults } = useSearchResults();
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Her input değişiminde arama tetiklenir
  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    if (!inputValue.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(inputValue)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.items || []);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    return () => controller.abort();
  }, [inputValue, setResults]);

  // Eski "Ara" butonu geri geldi, ama input değiştikçe de arama yapılır
  const handleSearch = () => {
    setInputValue(search);
  };

  // Her input değişiminde arama tetiklenecek şekilde inputValue güncellenir
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Explore Books</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Kitap ara..."
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: '#501a03',
            borderRadius: 8,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ara</Text>
        </TouchableOpacity>
      </View>
      {results.length === 0 && !loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
          <Text style={{ fontSize: 17, color: '#888', textAlign: 'center', maxWidth: 260 }}>
            Sonuç bulunamadı veya arama yapılmadı.
          </Text>
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookListCard book={item} />}
        ListFooterComponent={loading ? <Text style={{ textAlign: 'center', marginTop: 16 }}>Yükleniyor...</Text> : null}
      />
    </SafeAreaView>
  );
}

export default Explore