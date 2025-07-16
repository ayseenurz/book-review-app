import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import BookOfThisMonthCard from "./BookOfThisMonthCard";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface BookOfThisMonthProps {
  onLoaded?: () => void;
}

const PAGE_SIZE = 5;

const BookOfThisMonth: React.FC<BookOfThisMonthProps> = ({ onLoaded }) => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=fiction&orderBy=newest&printType=books&maxResults=40"
        );
        const data = await res.json();

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filtered = (data.items || []).filter((item: Book) => {
          const dateStr = item.volumeInfo.publishedDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        if (filtered.length > 0) {
          setAllBooks(filtered);
        } else {
          setAllBooks(data.items || []);
          setIsFallback(true);
        }
      } catch (error) {
        console.error("API Hatası:", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    };

    fetchBooks();
  }, []);

  
  useEffect(() => {
    const nextBooks = allBooks.slice(0, page * PAGE_SIZE);
    setDisplayedBooks(nextBooks);
  }, [allBooks, page]);

  const loadMore = () => {
    if (loadingMore) return; 
    if (page * PAGE_SIZE >= allBooks.length) return; 

    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 500); 
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isFallback ? "Son Yayınlanan Kitaplar" : "Bu Ayın Kitapları"}
      </Text>
      <FlatList
        data={displayedBooks}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item }) => (
          <BookOfThisMonthCard
            id={item.id}
            title={item.volumeInfo.title}
            authors={item.volumeInfo.authors}
            thumbnail={item.volumeInfo.imageLinks?.thumbnail}
            publishedDate={item.volumeInfo.publishedDate}
          />
        )}
        initialNumToRender={5}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    paddingHorizontal: 16,
    color: Colors.light.koyuKahverengi,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

export default BookOfThisMonth;