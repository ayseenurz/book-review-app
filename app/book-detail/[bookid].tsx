// pages/BookDetail.tsx
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import BookmarkButton from "@/components/BookmarkButton";
import Intro from "@/components/Details/Intro";
import Features from "@/components/Details/Features";
import Description from "@/components/Details/Description";
import Comments from "@/components/Details/Comments";
import LoadingScreen from "@/components/LoadingScreen";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HEADER_HEIGHT = 60;

const BookDetail = () => {
  const params = useLocalSearchParams();
  const bookid = typeof params.bookid === "string" ? params.bookid : Array.isArray(params.bookid) ? params.bookid[0] : "";
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!bookid) return;
    setLoading(true);
    setError(null);
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch(() => {
        setError("Kitap bulunamadı.");
        setTimeout(() => setLoading(false), 1000);
      });
  }, [bookid]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Text style={{ color: "red", marginTop: 32 }}>Giriş yapmalısınız.</Text>;
  if (loading) return <LoadingScreen />;
  if (error || !book) return <Text style={{ color: "red", marginTop: 32 }}>{error || "Kitap bulunamadı."}</Text>;

  const volume = book?.volumeInfo;
  if (!volume) return <Text style={{ color: "red", marginTop: 32 }}>Kitap bilgisi bulunamadı.</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* SABİT HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require("@/assets/icons/back.png")} style={styles.backButton} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.details}>Kitap Detayları</Text>
        <BookmarkButton book={{ id: bookid, title: volume.title, author: volume.authors?.join(", ") || "Bilinmeyen yazar", coverUrl: volume.imageLinks?.thumbnail, publishedDate: volume.publishedDate }} />
      </View>

      {/* SCROLLABLE CONTENT */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={HEADER_HEIGHT}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}>
          <Intro title={volume.title} author={volume.authors?.join(", ") || "Bilinmeyen yazar"} thumbnail={volume.imageLinks?.thumbnail} />
          <Features volume={volume} />
          <Description description={volume.description} />
          <Comments bookId={bookid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
  },
  backButton: {
    width: 28,
    height: 28,
  },
  details: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
  },
});

export default BookDetail;
