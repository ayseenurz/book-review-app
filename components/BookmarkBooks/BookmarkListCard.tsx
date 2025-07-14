import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BookmarkListCardProps = {
  book: any;
  onPress?: () => void;
};

const BookmarkListCard: React.FC<BookmarkListCardProps> = ({
  book,
  onPress,
}) => {
  const volume = book?.volumeInfo || {};
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {volume.imageLinks?.thumbnail ? (
        <Image
          source={{ uri: volume.imageLinks.thumbnail }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {volume.title || "Başlıksız Kitap"}
        </Text>
        <Text style={styles.authors} numberOfLines={1}>
          {volume.authors ? volume.authors.join(", ") : "Bilinmeyen Yazar"}
        </Text>
        {volume.publishedDate && (
          <Text style={styles.date}>{volume.publishedDate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BookmarkListCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.acikKrem,
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 14,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    backgroundColor: "#f5f5f5",
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 4,
  },
  authors: {
    color: "#666",
    fontSize: 13,
    marginBottom: 2,
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
});
