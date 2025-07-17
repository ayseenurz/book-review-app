import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SuggestedBooksCard from "./SuggestedBooksCard";
import { MotiView } from "moti";

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

interface SuggestedBooksProps {
  onLoaded?: () => void;
}

const SuggestedBooks: React.FC<SuggestedBooksProps> = ({ onLoaded }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=fiction")
      .then((res) => res.json())
      .then((data) => {
        const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
        setBooks(shuffle(data.items || []));
      })
      .catch((error) => console.error("API hatası:", error))
      .finally(() => {
        setLoading(false);
        if (onLoaded) onLoaded();
      });
  }, []);
  

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push("/book-detail/1")}> 
      <Text style={styles.title}>Okuman Gerekenler</Text>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={books}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 500,
                delay: index * 100,
              }}
            >
              <SuggestedBooksCard
                title={item.volumeInfo.title}
                authors={item.volumeInfo.authors}
                thumbnail={item.volumeInfo.imageLinks?.thumbnail}
                publishedDate={item.volumeInfo.publishedDate}
                id={item.id}
              />
            </MotiView>
          )}
          
          contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
        />
      </View>
      <View style={{height: 60}}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  title: {
    fontSize:20,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 16,
    color: Colors.light.koyuKahverengi,
  },
});

export default SuggestedBooks;
