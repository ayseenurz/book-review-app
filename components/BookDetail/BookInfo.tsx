import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface BookInfoProps {
  book: any;
  router: any;
}

const BookInfo: React.FC<BookInfoProps> = ({ book, router }) => {
  const volume = book?.volumeInfo || {};
  return (
    <View style={styles.bookInfoContainer}>
      {volume.imageLinks?.thumbnail ? (
        <Image
          source={{ uri: volume.imageLinks.thumbnail }}
          style={styles.bookImage}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[
            styles.bookImage,
            {
              backgroundColor: "#eee",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "#aaa" }}>Kapak Yok</Text>
        </View>
      )}
      <Text style={styles.bookTitle}>{volume.title}</Text>
      {volume.authors && volume.authors.length > 0 ? (
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/author-detail/${encodeURIComponent(volume.authors[0])}`
            )
          }
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.bookAuthor,
              { textDecorationLine: "underline", color: "#6B4F27" },
            ]}
          >
            {volume.authors.join(", ")}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.bookAuthor}>Bilinmeyen yazar</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bookInfoContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#E0D8CF",
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#f2eee9",
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#3e2723",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#6B4F27",
    textAlign: "center",
  },
});

export default BookInfo;
