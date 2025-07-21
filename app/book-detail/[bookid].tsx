import BookInfo from "@/components/BookDetail/BookInfo";
import Comments from "@/components/BookDetail/Comments";
import Description from "@/components/BookDetail/Description";
import Features from "@/components/BookDetail/Features";
import BookmarkButton from "@/components/BookmarkButton";
import LoadingScreen from "@/components/LoadingScreen";
import ReadingListButton from "@/components/ReadingList/ReadingListButton";
import { useRecentlyViewedBooks } from "@/components/RecentlyViewedBooksContext";
import { db } from "@/configs/FirebaseConfig";
import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { MotiView } from "moti";
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
  const [inReadingList, setInReadingList] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

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
    const checkInList = async () => {
      const json = await AsyncStorage.getItem("READING_LIST");
      let list = json ? JSON.parse(json) : [];
      setInReadingList(list.some((b: any) => b.id === bookid));
    };
    checkInList();
  }, [bookid]);

  useEffect(() => {
    if (!bookid) return;
    const countRef = doc(db, "BookFavoritesCount", bookid);
    const unsubscribe = onSnapshot(countRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavoriteCount(docSnap.data().count || 0);
      } else {
        setFavoriteCount(0);
      }
    });
    return () => unsubscribe();
  }, [bookid]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn)
    return <Text style={styles.errorText}>Giriş yapmalısınız.</Text>;
  if (loading) return <LoadingScreen />;
  if (error || !book)
    return <Text style={styles.errorText}>{error || "Kitap bulunamadı."}</Text>;

  const volume = book?.volumeInfo;
  if (!volume)
    return <Text style={styles.errorText}>Kitap bilgisi bulunamadı.</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={HEADER_HEIGHT}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("@/assets/icons/back.png")}
                  style={styles.backButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.details}>Kitap Detayları</Text>
              </View>
              <View style={styles.headerRight}>
                <ReadingListButton
                  id={bookid}
                  title={volume.title}
                  authors={volume.authors}
                  thumbnail={volume.imageLinks?.thumbnail}
                  publishedDate={volume.publishedDate}
                />
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
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <>
                  <BookInfo book={book} router={router} />
                  <Features book={book} favoriteCount={favoriteCount} />
                  <Description book={book} />
                  {isSignedIn && <Comments bookId={bookid} />}
                </>
              }
              renderItem={({ item }) => (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentUserName}>{item.userName}</Text>
                  <Text style={styles.commentDate}>{item.createdAt}</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  {item.rating && (
                    <Text style={styles.commentRating}>
                      Puan: {item.rating}
                    </Text>
                  )}
                </View>
              )}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
            />
          </MotiView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
    marginLeft: 30,
    color: Colors.light.koyuKahverengi,
    flex: 1,
    textAlign: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
  readingListBadge: {
    backgroundColor: "#f2eee9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  readingListBadgeText: {
    color: "#6B4F27",
    fontSize: 12,
    fontWeight: "bold",
  },
  readingListAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f2eee9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  errorText: {
    color: "red",
    marginTop: 32,
  },
  commentContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  commentUserName: {
    fontWeight: "bold",
    color: "#6c584c",
    marginBottom: 2,
  },
  commentDate: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
  },
  commentRating: {
    color: "#a3917b",
    fontSize: 14,
  },
  flatListContent: {
    paddingBottom: 32,
  },
});

export default BookDetail;
