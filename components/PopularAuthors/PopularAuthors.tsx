import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopularAuthorsCard from "./PopularAuthorsCard";
import { Colors } from "@/constants/Colors";




const PopularAuthors: React.FC = () => {
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=fiction")
      .then((res) => res.json())
      .then((data) => {
        const authorSet = new Set<string>();
        data.items?.forEach((item: any) => {
          item.volumeInfo?.authors?.forEach((author: string) => {
            authorSet.add(author);
          });
        });
        setAuthors(Array.from(authorSet).slice(0, 10));
      })
      .catch((error) => console.error("API hatası:", error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }
  const colors = ["#a3917b", "#6c584c", "#c2b6a3", "#a89984", "#7a6f63"];

  return (
    <View>
      <Text style={styles.title}>Popüler Yazarlar</Text>
      <View style={styles.container}>
        <FlatList
          data={authors}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => router.push(`/author-detail/${encodeURIComponent(item)}`)}>
              <PopularAuthorsCard name={item} backgroundColor={colors[index % colors.length]} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    alignContent: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    margin: 12,
    color: Colors.light.koyuKahverengi,
  },
});

export default PopularAuthors;
