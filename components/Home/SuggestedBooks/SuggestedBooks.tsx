import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SuggestedBooksCard from "./SuggestedBooksCard";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface SuggestedBooksProps {
  books: Book[];
}

const SuggestedBooks: React.FC<SuggestedBooksProps> = ({ books }) => {
  const router = useRouter();
  if (!books || books.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Okuman Gerekenler</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => router.push("/AllBooksList/SuggestedBooksAll")}
        >
          <Text style={styles.seeAllText}>Hepsini Gör</Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          horizontal
          data={books}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 500,
                delay: index * 100,
              }}
            >
              <SuggestedBooksCard
                title={item.volumeInfo.title}
                authors={item.volumeInfo.authors}
                thumbnail={item.volumeInfo.imageLinks?.thumbnail}
                publishedDate={item.volumeInfo.publishedDate}
                id={item.id}
              />
            </MotiView>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
    color: Colors.light.koyuKahverengi,
  },
  seeAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#f2eee9",
  },
  seeAllText: {
    color: "#6B4F27",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default SuggestedBooks;
