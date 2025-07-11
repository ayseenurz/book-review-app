import { Colors } from "@/constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BookmarkButton from "../BookmarkButton";

interface SuggestedBooksCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
  id: string;
}

const screenWidth = Dimensions.get("window").width;

const BOOKMARKS_KEY = 'BOOKMARKED_BOOKS';

const addToBookmarks = async (book: any) => {
  try {
    const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
    let bookmarks = json ? JSON.parse(json) : [];
    if (!bookmarks.some((b: any) => b.id === book.id)) {
      bookmarks.push(book);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (e) {}
};

const SuggestedBooksCard: React.FC<SuggestedBooksCardProps> = ({
  title,
  authors,
  thumbnail,
  publishedDate,
  id,
}) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
    return (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 120 }]}
      onPress={() => {
        if (id) {
          router.push(`/book-detail/${id}`);
        }
      }}
    >
      {thumbnail && <Image source={{ uri: thumbnail }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.authors}>{authors?.join(", ") || "Bilinmeyen yazar"}</Text>
        <Text style={styles.date}>{publishedDate}</Text>
      </View>
      <BookmarkButton book={{ id, title, authors, coverUrl: thumbnail, publishedDate }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.griKahve,
    padding: 16,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    alignSelf: "flex-start",
    elevation: 3,
    flexDirection: "row",
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 6,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
  },
  authors: {
    color: "#555",
    marginTop: 4,
  },
  date: {
    color: "#999",
    marginTop: 6,
    fontSize: 12,
  },
});

export default SuggestedBooksCard;
