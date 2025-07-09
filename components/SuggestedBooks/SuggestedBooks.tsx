import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SuggestedBooksCard from "./SuggestedBooksCard";
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


const SuggestedBooks: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=fiction")
      .then((res) => res.json())
      .then((data) => {
        // Kitapları rastgele karıştır
        const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
        setBooks(shuffle(data.items || []));
      })
      .catch((error) => console.error("API hatası:", error))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push("/book-detail/1")}> 
      <Text style={styles.title}>Okuman Gerekenler</Text>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={books}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <SuggestedBooksCard
              title={item.volumeInfo.title}
              authors={item.volumeInfo.authors}
              thumbnail={item.volumeInfo.imageLinks?.thumbnail}
              publishedDate={item.volumeInfo.publishedDate}
              id={item.id}
            />
          )}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize:20,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 16,
  },
});

export default SuggestedBooks;
