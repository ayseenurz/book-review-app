import BookmarkButton from "@/components/BookmarkButton";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BookCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
  id: string;
}

const screenWidth = Dimensions.get("window").width;
const router = useRouter();

const BOOKMARKS_KEY = "BOOKMARKED_BOOKS";

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

const BookOfThisMonthCard: React.FC<BookCardProps> = ({
  title,
  authors,
  thumbnail,
  publishedDate,
  id,
}) => {
  const [bookmarked, setBookmarked] = React.useState(false);
  return (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 64 }]}
      onPress={async () => {
        await new Promise((res) => setTimeout(res, 200));
        router.push(`/book-detail/${id}`);
      }}
    >
      {thumbnail && <Image source={{ uri: thumbnail }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.authors}>
          {authors?.join(", ") || "Bilinmeyen yazar"}
        </Text>
        <Text style={styles.date}>{publishedDate}</Text>
      </View>
      <BookmarkButton
        type="book"
        item={{ id, title, authors, coverUrl: thumbnail, publishedDate }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.koyuKahverengi,
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

export default BookOfThisMonthCard;
