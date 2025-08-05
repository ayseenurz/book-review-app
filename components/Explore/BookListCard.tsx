import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BookListCardProps = {
  book: any;
  showBookmark?: boolean;
  onRemoveFavorite?: (bookId: string) => void;
  fullWidth?: boolean;
  horizontal?: boolean;
  cardHeight?: number;
};

const MAX_AUTHORS_LENGTH = 38;

function getTruncatedAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return "";
  const joined = authors.join(", ");
  if (joined.length <= MAX_AUTHORS_LENGTH) return joined;

  let result = "";
  for (let i = 0; i < authors.length; i++) {
    const next = result ? result + ", " + authors[i] : authors[i];
    if (next.length > MAX_AUTHORS_LENGTH) {
      result = result.trim();
      if (result.endsWith(",")) result = result.slice(0, -1);
      return result + "…";
    }
    result = next;
  }
  return result;
}

const BookListCard: React.FC<BookListCardProps> = ({
  book,
  showBookmark = false,
  onRemoveFavorite,
  fullWidth = false,
  horizontal = false,
  cardHeight,
}) => {
  const router = useRouter();
  const volume = book.volumeInfo || book;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ position: "relative" }}>
        {showBookmark && (
          <TouchableOpacity
            style={styles.bookmarkIcon}
            onPress={() => onRemoveFavorite && onRemoveFavorite(book.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("@/assets/icons/checked-bookmark.png")}
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.card,
            fullWidth && styles.cardFullWidth,
            horizontal && styles.cardHorizontal,
            cardHeight ? { height: cardHeight } : {},
          ]}
          onPress={() => router.push(`/book-detail/${book.id}`)}
        >
          {volume.imageLinks?.thumbnail && (
            <Image
              source={{ uri: volume.imageLinks.thumbnail }}
              style={horizontal ? styles.imageHorizontal : styles.image}
            />
          )}
          <View style={[styles.info, horizontal && styles.infoHorizontal]}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {volume.title}
            </Text>
            {volume.authors && (
              <Text
                style={styles.authors}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getTruncatedAuthors(volume.authors)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookListCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    height: 200,
    width: 160,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardFullWidth: {
    width: "95%",
    alignSelf: "stretch",
  },
  cardHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    width: "90%",
    minWidth: 0,
    paddingHorizontal: 10,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginBottom: 12,
  },
  imageHorizontal: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 16,
    marginBottom: 0,
  },
  info: {
    flex: 1,
  },
  infoHorizontal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#222",
  },
  authors: {
    color: "#666",
    fontSize: 14,
  },
  bookmarkIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 2,
  },
});
