import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ReadingListCardProps {
  book: {
    id: string;
    title: string;
    authors?: string[];
    coverUrl?: string;
    publishedDate?: string;
  };
  fullWidth?: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const READING_LIST_KEY = "READING_LIST";

const ReadingListCard: React.FC<ReadingListCardProps> = ({
  book,
  fullWidth = false,
}) => {
  const router = useRouter();
  const [inReadingList, setInReadingList] = useState(true);
  const [pressed, setPressed] = useState(false);

  const handleRemoveFromReadingList = async () => {
    try {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      list = list.filter((b: any) => b.id !== book.id);
      await AsyncStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
      setInReadingList(false);
    } catch (e) {}
  };

  if (!inReadingList) return null;

  return (
    <Pressable
      onPress={() => router.push(`/book-detail/${book.id}`)}
      style={({ pressed: isPressed }) => [
        styles.card,
        fullWidth ? styles.cardFullWidth : styles.cardProfile,
        { flexDirection: fullWidth ? "row" : "column" },
        isPressed && styles.cardPressed,
      ]}
    >
      <Pressable
        onPress={handleRemoveFromReadingList}
        style={({ pressed: iconPressed }) => [
          styles.readingListCheckIcon,
          iconPressed && styles.readingListCheckIconPressed,
        ]}
        hitSlop={8}
      >
        <Feather name="check" size={14} color={pressed ? "#fff" : "#3CB371"} />
      </Pressable>
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={[
            fullWidth ? styles.imageFull : styles.image,
            styles.imageShadow,
          ]}
        />
      ) : (
        <View
          style={
            fullWidth ? styles.imagePlaceholderFull : styles.imagePlaceholder
          }
        >
          <Text style={styles.placeholderText}>Kapak Yok</Text>
        </View>
      )}
      <View style={fullWidth ? styles.info : styles.infoProfile}>
        <View style={styles.infoBg} />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {book.title}
        </Text>
        <Text style={styles.authors} numberOfLines={1} ellipsizeMode="tail">
          {book.authors?.join(", ") || "Bilinmeyen yazar"}
        </Text>
        <Text style={styles.date}>{book.publishedDate}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 10,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#ece6df",
    overflow: "hidden",
    minHeight: 120,
  },
  cardProfile: {
    width: 180,
    height: 240,
  },
  cardFullWidth: {
    width: SCREEN_WIDTH - 32,
    height: 130,
    marginRight: 0,
    marginBottom: 16,
    alignItems: "center",
    padding: 16,
  },
  cardPressed: {
    backgroundColor: "#f7f3ee",
    shadowOpacity: 0.18,
    borderColor: "#d6cfc2",
    transform: [{ scale: 0.98 }],
  },
  readingListCheckIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#e6f7ed",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#b2e2c6",
    opacity: 1,
    shadowColor: "#3CB371",
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  readingListCheckIconPressed: {
    backgroundColor: "#3CB371",
    borderColor: "#3CB371",
    opacity: 1,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  imageFull: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    marginBottom: 0,
    backgroundColor: "#eee",
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imagePlaceholder: {
    width: 90,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderFull: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    marginBottom: 0,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    alignItems: "flex-start",
    width: "70%",
    marginLeft: 12,
    justifyContent: "center",
    position: "relative",
  },
  infoProfile: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 8,
    position: "relative",
  },
  infoBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(242,238,233,0.25)",
    borderRadius: 10,
    zIndex: -1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  authors: {
    color: "#555",
    fontSize: 13,
    marginBottom: 2,
  },
  date: {
    color: "#888",
    fontSize: 11,
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 12,
  },
});

export default ReadingListCard;
