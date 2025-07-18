import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopularAuthorsCard from "./PopularAuthorsCard";
import { MotiView } from "moti";


interface PopularAuthorsProps {
  onLoaded?: () => void;
}

const PopularAuthors: React.FC<PopularAuthorsProps> = ({ onLoaded }) => {
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
        if (onLoaded) onLoaded();
      });
  }, []);

  
  const colors = ["#a3917b", "#6c584c", "#c2b6a3", "#a89984", "#7a6f63"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popüler Yazarlar</Text>
      <View style={styles.contentContainer}>
        <FlatList
          data={authors}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: 20 }}   // sağdan sola gelsin
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 500,
                delay: index * 100, // sıralı animasyon
              }}
            >
              <TouchableOpacity onPress={() => router.push(`/author-detail/${encodeURIComponent(item)}`)}>
                <PopularAuthorsCard name={item} backgroundColor={colors[index % colors.length]} />
              </TouchableOpacity>
            </MotiView>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:8
  },
  title: {
    alignContent: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    margin: 14,
    color: Colors.light.koyuKahverengi,
  },
  contentContainer: {
    flex: 1,
  },
});

export default PopularAuthors;
