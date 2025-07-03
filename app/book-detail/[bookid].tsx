import Features from '@/components/Details/Features';
import Intro from '@/components/Details/Intro';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';

// Google Books API anahtarınızı buraya ekleyin veya .env'den alın
const GOOGLE_BOOKS_API_KEY = 'AIzaSyDirdTKGcJsDXi5yGqGKmfXV2LWHMsSE5c';

const BookDetail = () => {
  const params = useLocalSearchParams();
  const bookid = typeof params.bookid === 'string' ? params.bookid : Array.isArray(params.bookid) ? params.bookid[0] : '';
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookid) return;
    setLoading(true);
    setError(null);
    const url = `https://www.googleapis.com/books/v1/volumes/${bookid}${GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Kitap bulunamadı.');
        setLoading(false);
      });
  }, [bookid]);

  /*// DEBUG: book ve volume değiştiğinde console.log ile yazdır
  React.useEffect(() => {
    if (book) {
      console.log('book:', JSON.stringify(book, null, 2));
      if (book.volumeInfo) {
        console.log('volume:', book.volumeInfo);
      }
    }
  }, [book]);*/

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;
  if (error || !book) return <Text style={{ color: 'red', marginTop: 32 }}>{error || 'Kitap bulunamadı.'}</Text>;

  const volume = book?.volumeInfo;
  if (!volume) return <Text style={{ color: 'red', marginTop: 32 }}>Kitap bilgisi bulunamadı.</Text>;

  // DEBUG: Gelen verileri ekrana yazdır
  return (
    <SafeAreaView>
      <Intro
        title={volume.title}
        author={volume.authors?.join(', ') || 'Bilinmeyen yazar'}
        description={volume.description || ''}
        thumbnail={volume.imageLinks?.thumbnail}
      />
      <Features volume={volume} />
    </SafeAreaView>
  )
}

export default BookDetail