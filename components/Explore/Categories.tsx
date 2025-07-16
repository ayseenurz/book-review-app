import { ScrollView, StyleSheet, Text, View } from "react-native";
import ExploreListCard from "./ExploreListCard";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const categories = [
  { genre: "Çocuk", image: require("@/assets/icons/child.png") },
  { genre: "İş Dünyası ve Ekonomi", image: require("@/assets/icons/economic.png") },
  { genre: "Sosyal Bilimler", image: require("@/assets/icons/social-science.png") },
  { genre: "Tarih", image: require("@/assets/icons/history.png") },
  { genre: "Biyografi", image: require("@/assets/icons/biography.png") },
  { genre: "Din", image: require("@/assets/icons/religion.png") },
  { genre: "Bilim Kurgu", image: require("@/assets/icons/scifi.png") },
  { genre: "Teknoloji ve Mühendislik", image: require("@/assets/icons/technology.png") },
  { genre: "Fantastik", image: require("@/assets/icons/fantasy.png") },
  { genre: "Kişisel Gelişim", image: require("@/assets/icons/help.png") },
];

export default function Categories() {
  const router = useRouter();
  return (
      <View style={styles.container}>
      <Text style={styles.title}>
        Kategoriler
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {categories.map((cat, idx) => (
          <ExploreListCard
            key={cat.genre}
            genre={cat.genre}
            onPress={() => {
              router.push({
                pathname: "/category-list/[genre]",
                params: { genre: cat.genre },
              });
            }}
            image={cat.image}
            compact
            cardHeight={90}
            cardWidth={90}
            style={{ marginRight: 4 }}
            index={idx}
            hideGenreName // sadece icon göstermek için
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
  title: {
    fontSize:20,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 16,
    color: Colors.light.koyuKahverengi,
  },
});