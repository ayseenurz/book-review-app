import BookOfThisMonth from "@/components/BookOfMonth/BookOfThisMonth";
import Categories from "@/components/Explore/Categories";
import { useFavorites } from "@/components/FavoritesContext";
import Header from "@/components/Header/Header";
import LoadingScreen from "@/components/LoadingScreen";
import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import SuggestedBooks from "@/components/SuggestedBooks/SuggestedBooks";
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet } from "react-native";

const Home = () => {
  const { favorites } = useFavorites();
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const allLoaded = !loadingBooks && !loadingSuggested && !loadingAuthors;

  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch işlemini fonksiyonlaştır
  const fetchData = useCallback(() => {
    setTimeout(() => {
      setLoadingBooks(false);
      setLoadingSuggested(false);
      setLoadingAuthors(false);
    }, 1500);
  }, []);

  // Pull-to-refresh fonksiyonu
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 1800);
  }, [fetchData]);

  if (!allLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6c584c"]}
            tintColor="#6c584c"
          />
        }
      >
        <Categories />
        <BookOfThisMonth onLoaded={() => setLoadingBooks(false)} />
        <PopularAuthors onLoaded={() => setLoadingAuthors(false)} />
        <SuggestedBooks onLoaded={() => setLoadingSuggested(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFBF9",
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;
