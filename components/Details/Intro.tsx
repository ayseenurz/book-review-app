// components/Details/Intro.tsx
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IntroProps {
  title: string;
  author: string;
  thumbnail?: string;
}

const Intro: React.FC<IntroProps> = ({ title, author, thumbnail }) => {
  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <Image
          source={thumbnail ? { uri: thumbnail } : require("@/assets/images/book-cover.png")}
          style={styles.image}
        />
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <TouchableOpacity onPress={() => router.push(`/author-detail/${author}`)}>
            <Text style={styles.author} numberOfLines={1}>{author || "Bilinmeyen Yazar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  row: {
    flexDirection: "row",
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
});

export default Intro;
