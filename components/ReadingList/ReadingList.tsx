import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReadingListCard from "./ReadingListCard";

const READING_LIST_KEY = "READING_LIST";

const ReadingList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchList = async () => {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      setBooks(json ? JSON.parse(json) : []);
    };
    fetchList();
  }, []);

  const showAll = () => {
    router.push("/AllBooksList/ReadingListAllBooks");
  };

  if (!books.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Daha sonra okumak için kitap ekleyin.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Daha Sonra Okuyacaklarım</Text>
        <TouchableOpacity onPress={showAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Hepsini Gör</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={books.slice(0, 10)}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReadingListCard book={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c584c",
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
  flatListContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 15,
    fontStyle: "italic",
  },
});

export default ReadingList;
