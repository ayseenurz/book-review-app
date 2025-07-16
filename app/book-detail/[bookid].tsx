import Comments from "@/components/Details/Comments";
import Description from "@/components/Details/Description";
import Features from "@/components/Details/Features";
import Intro from "@/components/Details/Intro";
import LoadingScreen from "@/components/LoadingScreen";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text } from "react-native";

const GOOGLE_BOOKS_API_KEY = "AIzaSyDirdTKGcJsDXi5yGqGKmfXV2LWHMsSE5c";

const BookDetail = () => {
  const params = useLocalSearchParams();
  const bookid =
    typeof params.bookid === "string"
      ? params.bookid
      : Array.isArray(params.bookid)
      ? params.bookid[0]
      : "";
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!bookid) return;
    setLoading(true);
    setError(null);
    const url = `https://www.googleapis.com/books/v1/volumes/${bookid}${GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : ""}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        if (data && data.volumeInfo && data.volumeInfo.categories) {
          console.log('Kitabın kategorileri:', data.volumeInfo.categories);
        } else {
          console.log('Bu kitap için kategori bilgisi yok.');
        }
        setTimeout(() => setLoading(false), 1000);
      })
      .catch(() => {
        setError("Kitap bulunamadı.");
        setTimeout(() => setLoading(false), 1000);
      });
  }, [bookid]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Text style={{ color: 'red', marginTop: 32 }}>Giriş yapmalısınız.</Text>;

  if (loading)
    return <LoadingScreen />;
  if (error || !book)
    return (
      <Text style={{ color: "red", marginTop: 32 }}>
        {error || "Kitap bulunamadı."}
      </Text>
    );

  const volume = book?.volumeInfo;
  if (!volume)
    return (
      <Text style={{ color: "red", marginTop: 32 }}>
        Kitap bilgisi bulunamadı.
      </Text>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Intro
            title={volume.title}
            author={volume.authors?.join(", ") || "Bilinmeyen yazar"}
            description={volume.description || ""}
            thumbnail={volume.imageLinks?.thumbnail}
            id={bookid}
          />
          <Features volume={volume} />
          <Description description={volume.description} />
          <Comments bookId={bookid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BookDetail;
