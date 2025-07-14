import BookOfThisMonth from "@/components/BookOfMonth/BookOfThisMonth";
import Categories from "@/components/Explore/Categories";
import { useFavorites } from "@/components/FavoritesContext";
import Header from "@/components/Header/Header";
import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import SuggestedBooks from "@/components/SuggestedBooks/SuggestedBooks";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const Home = () => {
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // İlk yükleme
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch işlemini fonksiyonlaştır
  const fetchData = useCallback(() => {
    setLoading(true);
    // Burada gerçek fetch işlemlerini başlatabilirsiniz
    // Örnek: 1.5 saniye sonra loading'i false yap
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  }, []);

  // Pull-to-refresh fonksiyonu
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Eğer loading ise sadece ActivityIndicator göster, içerik gösterme
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c584c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6c584c"]}
            tintColor="#6c584c"
          />
        }
      >
        <Header />
        <Categories />
        <BookOfThisMonth />
        <PopularAuthors />
        <SuggestedBooks />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // Sayfanın üst kısmında, içerik üzerinde gösterilecek şekilde
    alignItems: "center",
    marginTop: 32,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },
});

export default Home;
