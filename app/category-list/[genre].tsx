import CategoriesListCard from "@/components/Explore/CategoriesListCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Fantastik": [
    "fantasy",
    "fantastik",
    "Art / Subjects & Themes / Science Fiction & Fantasy"
  ],
  "Korku": ["horror", "korku", "supernatural"],
  "Tarih": ["history", "tarih", "historical"],
  "Çocuk": ["child", "children", "çocuk", "juvenile", "Juvenile Nonfiction"],
  "Biyografi": ["biography", "biyografi"],
  "Bilim Kurgu": [
    "science fiction",
    "bilim kurgu",
    "scifi",
    "Art / Subjects & Themes / Science Fiction & Fantasy",
    "Technology & Engineering / Robotics",
    "Computers / Artificial Intelligence / General",
    "Science / Mechanics / General"
  ],
  "Roman": ["novel", "roman"],
  "Kişisel Gelişim": ["self-help", "kişisel gelişim", "personal growth"],
  "İş Dünyası ve Ekonomi": [
    "business",
    "ekonomi",
    "economics",
    "Business & Economics",
    "Business & Economics / Accounting / General",
    "Business & Economics / Insurance / Health",
    "Business & Economics / Development / General",
    "Business & Economics / General", 
    "Business & Economics / Banks & Banking",
    "Business & Economics / Economic Conditions",
    "Business & Economics / Economics / Theory",
    "Business & Economics / Education",
    "Business & Economics / Economics / General",
    "Business & Economics / Environmental Economics",
    "Business & Economics / Corporate Finance / General",
    "Business & Economics / Corporate Governance",
    "Business & Economics / Economics / Comparative",
    "Business & Economics / Public Relations",
    "Business & Economics / Research & Development",
    "Business & Economics / Economic History"
  ],
  "Teknoloji ve Mühendislik": [
    "technology",
    "engineering",
    "teknoloji",
    "mühendislik",
    "Computers",
    "Science & Technology",
    "Technology & Engineering / Robotics",
    "Computers / Artificial Intelligence / General",
    "Science / Mechanics / General"
  ],
  "Sosyal Bilimler": [
    "social science",
    "sosyal bilimler",
    "Education",
    "Education / Research",
    "Education / Counseling",
    "Education / Administration",
    "Education / Teaching",
    "Social Science / Research",
    "Education / General",
    "Education / Counseling / Academic Development",
    "Political Science / Public Policy / Economic Policy",
    "Political Science / Geopolitics",
    "Political Science / History & Theory",
    "Political Science / Comparative Politics",
    "Political Science / International Relations / Trade & Tariffs",
    "Political Science / International Relations / Diplomacy",
    "Political Science / International Relations / General",
    "Political Science / World / Middle Eastern",
    "Business & Economics / Education"
  ],
  "Din": ["religion", "din", "Religion / Islam"],
};

function matchesCategory(googleCategories: string[] | undefined, appCategory: string): boolean {
  if (!googleCategories) return false;
  const keywords = CATEGORY_KEYWORDS[appCategory];
  if (!keywords) return false;
  return googleCategories.some(cat =>
    keywords.some(keyword =>
      cat.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

const CategoryListScreen = () => {
  const { genre } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genre) return;
    setLoading(true);
    setError(null);
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
        genre as string
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.items || []).filter((item: any) => {
          const googleCategories: string[] = item.volumeInfo.categories;
          return matchesCategory(googleCategories, genre as string);
        });
        setResults(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError("Bir hata oluştu.");
        setLoading(false);
      });
  }, [genre]);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;
  if (error)
    return <Text style={{ color: "red", marginTop: 32 }}>{error}</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButtonContainer}
          >
            <Image
              source={require("@/assets/icons/back.png")}
              style={styles.backButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.title}>{genre} Kategorisi</Text>
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoriesListCard
              title={item.volumeInfo.title}
              authors={item.volumeInfo.authors}
              thumbnail={item.volumeInfo.imageLinks?.thumbnail}
            />
          )}
          ListEmptyComponent={<Text>Bu kategoride kitap bulunamadı.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    marginBottom: 16,
    marginRight: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
});
