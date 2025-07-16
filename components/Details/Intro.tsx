import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import BookmarkButton from "../BookmarkButton";

interface IntroProps {
  title: string;
  author: string;
  description: string;
  thumbnail?: string;
  publishedDate?: string;
  pageCount?: string;
  language?: string;
  id?: string;
}

const Intro: React.FC<IntroProps> = ({
  title,
  author,
  description,
  thumbnail,
  publishedDate,
  pageCount,
  language,
  id,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/back.png")}
            style={styles.backButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.details}>Kitap Detayları</Text>
        {id && (
          <BookmarkButton
            book={{
              id,
              title,
              author,
              coverUrl: thumbnail,
              publishedDate,
            }}
          />
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.row}>
          <Image
            source={
              thumbnail
                ? { uri: thumbnail }
                : require("@/assets/images/book-cover.png")
            }
            style={styles.image}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <TouchableOpacity onPress={() => router.push(`/author-detail/${author}`)}>
              <Text style={styles.author} numberOfLines={1}>{author || "Bilinmeyen Yazar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 16,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.koyuKahverengi,
  },
  backButton: {
    width: 28,
    height: 28,
  },
  details: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
  },
});

export default Intro;
