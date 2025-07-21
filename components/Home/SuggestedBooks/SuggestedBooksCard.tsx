import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BookmarkButton from "../../BookmarkButton";
import ReadingListButton from "../../ReadingList/ReadingListButton";

interface SuggestedBooksCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
  id: string;
  fullWidth?: boolean;
}

const screenWidth = Dimensions.get("window").width;

const BOOKMARKS_KEY = "BOOKMARKED_BOOKS";
const READING_LIST_KEY = "READING_LIST";

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
  fullWidth = false,
}) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [inReadingList, setInReadingList] = useState(false);

  useEffect(() => {
    const checkInList = async () => {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      setInReadingList(list.some((b: any) => b.id === id));
    };
    checkInList();
  }, [id]);

  const handleAddToReadingList = async () => {
    try {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      if (!list.some((b: any) => b.id === id)) {
        list.push({ id, title, authors, coverUrl: thumbnail, publishedDate });
        await AsyncStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
        setInReadingList(true);
      }
    } catch (e) {}
  };

  const handleRemoveFromReadingList = async () => {
    try {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      list = list.filter((b: any) => b.id !== id);
      await AsyncStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
      setInReadingList(false);
    } catch (e) {}
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        fullWidth ? styles.cardFullWidth : styles.cardCompact,
        { flexDirection: fullWidth ? "row" : "row" },
      ]}
      onPress={async () => {
        if (id) {
          await new Promise((res) => setTimeout(res, 200));
          router.push(`/book-detail/${id}`);
        }
      }}
    >
      <View style={styles.iconColumn}>
        <BookmarkButton
          type="book"
          item={{ id, title, authors, coverUrl: thumbnail, publishedDate }}
        />
        <ReadingListButton
          id={id}
          title={title}
          authors={authors}
          thumbnail={thumbnail}
          publishedDate={publishedDate}
        />
      </View>
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          style={fullWidth ? styles.imageFull : styles.image}
        />
      ) : (
        <View
          style={
            fullWidth ? styles.imagePlaceholderFull : styles.imagePlaceholder
          }
        >
          <Text style={styles.placeholderText}>Fotoğraf bulunamadı</Text>
        </View>
      )}
      <View style={fullWidth ? styles.infoFull : styles.info}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.authors} numberOfLines={1} ellipsizeMode="tail">
          {authors?.join(", ") || "Bilinmeyen yazar"}
        </Text>
        <Text style={styles.date}>{publishedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.griKahve,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    alignSelf: "flex-start",
    elevation: 3,
    flexDirection: "row",
    position: "relative",
  },
  cardCompact: {
    width: 220,
    height: 150,
    padding: 10,
  },
  cardFullWidth: {
    width: screenWidth - 32,
    height: 130,
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    alignItems: "center",
  },
  iconColumn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  readingIconButton: {
    backgroundColor: "#f2eee9",
    marginLeft: 8,
    borderRadius: 14,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    opacity: 0.4,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 6,
    marginRight: 10,
  },
  imageFull: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
    marginBottom: 0,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    width: 90,
    height: 130,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#e0d6c8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b0a08b",
  },
  imagePlaceholderFull: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
    marginBottom: 0,
    backgroundColor: "#e0d6c8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b0a08b",
  },
  placeholderText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: 0,
  },
  infoFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: 0,
    marginLeft: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 15,
    color: "#222",
    marginBottom: 2,
    maxWidth: 130,
  },
  authors: {
    color: "#555",
    fontSize: 11,
    marginTop: 2,
    marginBottom: 2,
    maxWidth: 130,
  },
  date: {
    color: "#888",
    fontSize: 10,
    marginTop: 2,
    maxWidth: 130,
  },
});

export default SuggestedBooksCard;
