import { useRecentlyViewedBooks } from "@/components/RecentlyViewedBooksContext";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import LoadingScreen from "../../LoadingScreen";
import RecentlyViewedBooksCard from "./RecentlyViewedBooksCard";

const RecentlyViewedBooks = () => {
  const { recentlyViewed } = useRecentlyViewedBooks();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recentlyViewed.length) {
      setBooks([]);
      return;
    }
    setLoading(true);
    Promise.all(
      recentlyViewed.map(async (id) => {
        try {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${id}`
          );
          const data = await res.json();
          return {
            id,
            title: data.volumeInfo?.title || "",
            coverUrl: data.volumeInfo?.imageLinks?.thumbnail || undefined,
            ...data.volumeInfo,
          };
        } catch {
          return null;
        }
      })
    ).then((results) => {
      setBooks(results.filter(Boolean));
      setLoading(false);
    });
  }, [recentlyViewed]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!books.length) {
    return null; // Hiç kitap yoksa bu bölümü gösterme
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İncelemeye Devam Et</Text>
      <FlatList
        data={books.filter(Boolean)}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecentlyViewedBooksCard book={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default RecentlyViewedBooks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
    color: Colors.light.koyuKahverengi,
  },
});
