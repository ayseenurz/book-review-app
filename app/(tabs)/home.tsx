import BookOfThisMonth from "@/components/Home/BookOfMonth/BookOfThisMonth";
import Categories from "@/components/Explore/Categories";
import { useFavorites } from "@/components/FavoritesContext";
import Header from "@/components/Home/HomeHeader";
import LoadingScreen from "@/components/LoadingScreen";
import PopularAuthors from "@/components/Home/PopularAuthors/PopularAuthors";
import RecentlyViewedBooks from "@/components/Home/RecentlyViewed/RecentlyViewedBooks";
import SuggestedBooks from "@/components/Home/SuggestedBooks/SuggestedBooks";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const Home = () => {
  const { favorites } = useFavorites();
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const allLoaded = !loadingBooks && !loadingSuggested && !loadingAuthors;

  // Safe area için dinamik padding
  const safeTop = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;
  const safeBottom = Platform.OS === "ios" ? 24 : 16;

  useFocusEffect(useCallback(() => {}, []));

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
    <View
      style={[
        styles.safeArea,
        { paddingTop: safeTop, paddingBottom: safeBottom },
      ]}
    >
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
        <RecentlyViewedBooks />
        <View style={{ height: 60 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFBF9",
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;
