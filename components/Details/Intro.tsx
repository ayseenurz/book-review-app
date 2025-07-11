import { useNavigation } from "@react-navigation/native";
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
import BookmarkButton from "../BookmarkButton";
import { Colors } from "@/constants/Colors";

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
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("@/assets/icons/back.png")}
            style={styles.backButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.details}>Kitap Detayları</Text>
        <BookmarkButton book={{
          title,
          author,
          coverUrl: thumbnail || "",
          description,
          publishedDate,
          pageCount: pageCount ? Number(pageCount) : 0, // pageCount'u number'a çevirir
          language,
          id: id || ""
        }} />
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
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title || "Başlıksız Kitap"}
            </Text>
            <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
              {author || "Bilinmeyen Yazar"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
  },
  titleWrapper: {
    padding: 16,
    height: 200,
    justifyContent: "flex-end",
    borderRadius: 12,
    flex: 1,
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "#eee",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    textAlign: "left",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.koyuKahverengi,
    textAlign: "left",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  descBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flexGrow: 1,
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "left",
  },
  backButton: {
    width: 28,
    height: 28,
  },
  backButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  details: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    textAlign: "left",
  },
});
