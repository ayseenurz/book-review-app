import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  books: Book[];
}

const PAGE_SIZE = 5;

const BookOfThisMonth: React.FC<BookOfThisMonthProps> = ({ books }) => {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFallback(false);
    if (!books || books.length === 0) {
      setDisplayedBooks([]);
      return;
    }
    setDisplayedBooks(books.slice(0, PAGE_SIZE));
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const hasCurrentMonth = books.some((item: Book) => {
      const dateStr = item.volumeInfo.publishedDate;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });
    setIsFallback(!hasCurrentMonth);
    setPage(1);
  }, [books]);

  useEffect(() => {
    setDisplayedBooks(books.slice(0, page * PAGE_SIZE));
  }, [books, page]);

  const loadMore = () => {
    if (loadingMore) return;
    if (page * PAGE_SIZE >= books.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  if (!books || books.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {isFallback ? "Son Yayınlanan Kitaplar" : "Ayın Kitapları"}
        </Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => router.push("/AllBooksList/BooksofThisMonthAll")}
        >
          <Text style={styles.seeAllText}>Hepsini Gör</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayedBooks}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: "timing",
              duration: 500,
              delay: index * 100,
            }}
          >
            <BookOfThisMonthCard
              id={item.id}
              title={item.volumeInfo.title}
              authors={item.volumeInfo.authors}
              thumbnail={item.volumeInfo.imageLinks?.thumbnail}
              publishedDate={item.volumeInfo.publishedDate}
            />
          </MotiView>
        )}
        initialNumToRender={5}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    marginHorizontal: 8,
  },
  title: {
    paddingHorizontal: 16,
    color: Colors.light.koyuKahverengi,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  seeAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#f2eee9",
  },
  seeAllText: {
    color: "#6B4F27",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default BookOfThisMonth;
