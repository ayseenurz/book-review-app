import Categories from "@/components/Explore/Categories";
import { useFavorites } from "@/components/FavoritesContext";
import BookOfThisMonth from "@/components/Home/BookOfMonth/BookOfThisMonth";
import Header from "@/components/Home/HomeHeader";
import PopularAuthors from "@/components/Home/PopularAuthors/PopularAuthors";
import RecentlyViewedBooks from "@/components/Home/RecentlyViewed/RecentlyViewedBooks";
import SuggestedBooks from "@/components/Home/SuggestedBooks/SuggestedBooks";
import LoadingScreen from "@/components/LoadingScreen";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [bookOfMonthBooks, setBookOfMonthBooks] = useState<any[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<string[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);

  const safeTop = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;
  const safeBottom = Platform.OS === "ios" ? 24 : 16;

  const fetchData = useCallback(async () => {
    if (isFirstLoad) setLoading(true);
    try {
      const res = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=fiction&orderBy=newest&printType=books&maxResults=40"
      );
      const data = await res.json();
      setAllBooks(data.items || []);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const filtered = (data.items || []).filter((item: any) => {
        const dateStr = item.volumeInfo.publishedDate;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      });
      setBookOfMonthBooks(filtered.length > 0 ? filtered : data.items || []);

      const authorSet = new Set<string>();
      (data.items || []).forEach((item: any) => {
        item.volumeInfo?.authors?.forEach((author: string) => {
          authorSet.add(author);
        });
      });
      setPopularAuthors(Array.from(authorSet).slice(0, 10));

      const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
      setSuggestedBooks(shuffle([...(data.items || [])]));
    } catch (e) {
      setBookOfMonthBooks([]);
      setPopularAuthors([]);
      setSuggestedBooks([]);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setTimeout(() => setRefreshing(false), 1000));
  }, [fetchData]);

  if (loading && isFirstLoad) {
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
        <BookOfThisMonth books={bookOfMonthBooks} />
        <PopularAuthors authors={popularAuthors} />
        <SuggestedBooks books={suggestedBooks} />
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
