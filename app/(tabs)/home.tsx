import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import BookOfThisMonth from "@/components/BookOfMonth/BookOfThisMonth";
import Header from "@/components/Header/Header";
import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import SuggestedBooks from "@/components/SuggestedBooks/SuggestedBooks";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <ScrollView>
        <Header/>
        <BookOfThisMonth />
        <PopularAuthors />
        <SuggestedBooks />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});