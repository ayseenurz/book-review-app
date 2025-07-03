import { Colors } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ExploreListCard from '../../components/Explore/ExploreListCard';
import { useSearchResults } from "../../components/SearchResultsContext";
import BookListCard from "../BookList/BookListCard";

const Explore = () => {
  const router = useRouter();
  const { results, setResults } = useSearchResults();
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const genres = [
    "Roman", "Bilim Kurgu", "Fantastik", "Korku", "Tarih", "Biyografi", "Polisiye", "Çocuk", "Klasik", "Macera"
  ];

  const genreColors = [
    '#a3917b', '#6c584c', '#c2b6a3', '#a89984', '#7a6f63', '#e0b084', '#b7b7a4', '#ffe5b4', '#b5838d', '#adc178'
  ];
  const genreImages: Record<string, any> = {
    "Roman": require('../../assets/icons/roman.png'),
    "Bilim Kurgu": require('../../assets/icons/scifi.png'),
    "Fantastik": require('../../assets/icons/fantasy.png'),
    "Korku": require('../../assets/icons/horror.png'),
    "Tarih": require('../../assets/icons/history.png'),
    "Biyografi": require('../../assets/icons/biography.png'),
    "Polisiye": require('../../assets/icons/detective.png'),
    "Çocuk": require('../../assets/icons/child.png'),
    "Klasik": require('../../assets/icons/classic.png'),
    "Macera": require('../../assets/icons/adventure.png'),
  };
  // Her input değişiminde arama tetiklenir
  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    if (!inputValue.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            inputValue
          )}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.items || []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    return () => controller.abort();
  }, [inputValue, setResults]);

  // Eski "Ara" butonu geri geldi, ama input değiştikçe de arama yapılır
  const handleSearch = () => {
    setInputValue(search);
  };

  // Her input değişiminde arama tetiklenecek şekilde inputValue güncellenir
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Tab değişiminde veya sayfa odaklandığında arama sonuçlarını temizle
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Sadece arama kutusu boşsa sonuçları temizle
        if (!search.trim() && !inputValue.trim()) {
          setResults([]);
        }
      };
    }, [setResults, search, inputValue])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Kitapları Keşfet</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Kitap veya yazar ara..."
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <View style={styles.searchIconContainer}>
            {search.trim() ? (
              <TouchableOpacity onPress={() => { setSearch(''); setInputValue(''); }}>
                <Image
                  source={require('../../assets/icons/close.png')}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSearch}>
                <Image
                  source={require("../../assets/icons/search.png")}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!search.trim() && !inputValue.trim() && (
          <FlatList
            data={genres}
            keyExtractor={(item) => item}
            numColumns={2}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item, index }) => (
              <ExploreListCard
                genre={item}
                onPress={() => {
                  setSearch(item);
                  setInputValue(item);
                }}
                index={index}
                image={genreImages[item]}
              />
            )}
          />
        )}
        {(search.trim() || inputValue.trim()) && (
          <>
            {results.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Image
                  source={require("../../assets/icons/smartphone.png")}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyText}>
                  Sonuç bulunamadı veya arama yapılmadı.
                </Text>
              </View>
            )}
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BookListCard book={item} />}
              ListFooterComponent={
                loading ? <Text style={styles.loadingText}>Yükleniyor...</Text> : null
              }
            />
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFBF9",
  },
  header: {
    marginTop: 40,
    fontSize: 24,
    color: Colors.light.koyuKahverengi,
    fontWeight: "bold",
    margin: 24,
  },
  searchRow: {
    flexDirection: "row",
    backgroundColor: Colors.light.acikKrem,
    marginHorizontal: 24,
    marginVertical: 4,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: Colors.light.acikKahverengi,
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#501a03",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    opacity: 0.3,
    tintColor: "#000",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 17,
    color: "#888",
    textAlign: "center",
    maxWidth: 260,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 16,
  },
  searchIconContainer: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    opacity: 0.3,
  },
});

export default Explore;
