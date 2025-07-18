// pages/BookDetail.tsx
import BookInfo from "@/components/BookDetail/BookInfo";
import Comments from "@/components/BookDetail/Comments";
import Description from "@/components/BookDetail/Description";
import Features from "@/components/BookDetail/Features";
import BookmarkButton from "@/components/BookmarkButton";
import LoadingScreen from "@/components/LoadingScreen";
import { useRecentlyViewedBooks } from "@/components/RecentlyViewedBooksContext";
import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const HEADER_HEIGHT = 60;

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
  const { isLoaded, isSignedIn, user } = useUser();
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Yorum ekleme formu için state
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const { addRecentlyViewed } = useRecentlyViewedBooks();

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

  useEffect(() => {
    setCommentsLoading(true);
    fetch(
      `https://firestore.googleapis.com/v1/projects/book-69486/databases/(default)/documents/comments?where=bookId=='${bookid}'`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.documents)) {
          setComments(
            data.documents.map((doc: any) => ({
              id: doc.name.split("/").pop(),
              ...Object.fromEntries(
                Object.entries(doc.fields || {}).map(
                  ([k, v]: [string, any]) => {
                    if (v.stringValue !== undefined) return [k, v.stringValue];
                    if (v.integerValue !== undefined)
                      return [k, v.integerValue];
                    if (v.timestampValue !== undefined)
                      return [k, v.timestampValue];
                    if (v.doubleValue !== undefined) return [k, v.doubleValue];
                    if (v.booleanValue !== undefined)
                      return [k, v.booleanValue];
                    return [k, null];
                  }
                )
              ),
            }))
          );
        } else {
          setComments([]);
        }
        setCommentsLoading(false);
      })
      .catch(() => {
        setComments([]);
        setCommentsLoading(false);
      });
  }, [bookid]);

  useEffect(() => {
    addRecentlyViewed(bookid);
  }, [bookid]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn)
    return (
      <Text style={{ color: "red", marginTop: 32 }}>Giriş yapmalısınız.</Text>
    );
  if (loading) return <LoadingScreen />;
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={HEADER_HEIGHT}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("@/assets/icons/back.png")}
                style={styles.backButton}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.details}>Kitap Detayları</Text>
            <BookmarkButton
              type="book"
              item={{
                id: bookid,
                title: volume.title,
                author: volume.authors?.join(", ") || "Bilinmeyen yazar",
                coverUrl: volume.imageLinks?.thumbnail,
                publishedDate: volume.publishedDate,
              }}
            />
          </View>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                {/* Kitap görseli ortada, adı ve yazar altında */}
                <BookInfo volume={volume} router={router} />
                <Features volume={volume} />
                <Description description={volume.description} />
                {isSignedIn && <Comments bookId={bookid} />}
              </>
            }
            renderItem={({ item }) => (
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 12,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#6c584c",
                    marginBottom: 2,
                  }}
                >
                  {item.userName}
                </Text>
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>
                  {item.createdAt}
                </Text>
                <Text style={{ fontSize: 15 }}>{item.comment}</Text>
                {item.rating && (
                  <Text style={{ color: "#a3917b", fontSize: 14 }}>
                    Puan: {item.rating}
                  </Text>
                )}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF9",
  },
  header: {
    marginTop: 40,
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
  bookInfoContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  bookImage: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6c584c",
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#a3917b",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default BookDetail;
