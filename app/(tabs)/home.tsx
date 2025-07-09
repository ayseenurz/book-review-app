import BookOfThisMonth from "@/components/BookOfMonth/BookOfThisMonth";
import Header from "@/components/Header/Header";
import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import SuggestedBooks from "@/components/SuggestedBooks/SuggestedBooks";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet
} from "react-native";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [loadedComponents, setLoadedComponents] = useState(0);

  
  // Lottie ve loading ile ilgili kodlar kaldırıldı
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ flex: 1 }}>
        <Header />
        <BookOfThisMonth />
        <PopularAuthors />
        <SuggestedBooks />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
});

export default Home;
