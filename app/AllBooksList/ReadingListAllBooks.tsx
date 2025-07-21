import ReadingListCard from "@/components/ReadingList/ReadingListCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const READING_LIST_KEY = 'READING_LIST';

const ReadingListAllBooks = () => {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchList = async () => {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      setBooks(json ? JSON.parse(json) : []);
    };
    fetchList();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('@/assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Daha Sonra Okuyacaklarım</Text>
      </View>
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Daha sonra okumak için kitap ekleyin.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ReadingListCard book={item} fullWidth />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF9',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#f2eee9',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#6B4F27',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c584c',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
    fontStyle: 'italic',
  },
});

export default ReadingListAllBooks; 