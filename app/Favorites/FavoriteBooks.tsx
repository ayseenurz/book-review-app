import { useFavorites } from "@/components/FavoritesContext";
import LoadingScreen from "@/components/LoadingScreen";
import { db } from "@/configs/FirebaseConfig";
import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BookListCard from "../../components/Explore/BookListCard";

const FavoriteBooks = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { favorites, setFavorites } = useFavorites();
  const [bookDetails, setBookDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteBookIds = async (): Promise<string[]> => {
    if (!isLoaded || !isSignedIn || !user?.id) return [];
    try {
      const snap = await getDocs(collection(db, "Favorites", user.id, "books"));
      return snap.docs.map((doc) => doc.id);
    } catch (e) {
      return [];
    }
  };

  const fetchBookDetails = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setBookDetails([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const results: any[] = [];
      for (const id of ids) {
        try {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${id}`
          );
          const data = await res.json();
          if (data && data.id && data.volumeInfo) {
            results.push(data);
          }
        } catch (err) {}
      }
      setBookDetails(results);
    } catch (e) {
      setBookDetails([]);
    }
    setLoading(false);
  };

  const removeFromFavorites = async (bookId: string) => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    try {
      await deleteDoc(doc(db, "Favorites", user.id, "books", bookId));
      setFavorites((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });
      setBookDetails((prev) => prev.filter((b) => b.id !== bookId));
    } catch (error) {
      console.error("Favoriden çıkarma hatası:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        setLoading(true);
        const ids = await fetchFavoriteBookIds();
        if (isActive) {
          await fetchBookDetails(ids);
        }
      };
      load();
      return () => {
        isActive = false;
      };
    }, [isLoaded, isSignedIn, user?.id])
  );

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setLoading(true);
      const ids = await fetchFavoriteBookIds();
      if (isActive) {
        await fetchBookDetails(ids);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favori Kitaplarım</Text>
      {bookDetails.length > 0 && (
        <Text style={styles.count}>
          Toplamda <Text style={styles.countNumber}>{bookDetails.length}</Text>{" "}
          kitap favorilenmiş.
        </Text>
      )}
      {!isLoaded || !isSignedIn ? (
        <Text style={styles.infoText}>
          Favori kitaplarınızı görmek için giriş yapmalısınız.
        </Text>
      ) : loading ? (
        <LoadingScreen />
      ) : bookDetails.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="book" size={64} color="#a18262" />
          <Text style={styles.emptyText}>
            Henüz favori kitabın yok. {"\n"}Bir kitap eklemeye ne dersin?
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookDetails}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 40 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 400,
                delay: index * 100,
              }}
              style={styles.cardWrapper}
            >
              <BookListCard
                book={item}
                showBookmark={true}
                onRemoveFavorite={removeFromFavorites}
              />
            </MotiView>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
      <View style={{ height: 50 }}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFBF9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  count: {
    fontSize: 14,
    color: "#6c584c",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  countNumber: {
    fontWeight: "bold",
    color: "#3e2723",
  },
  infoText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 16,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 200,
    marginTop: 200,
  },
  emptyText: {
    color: "#7a6b5b",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  cardWrapper: {
    marginVertical: 8,
    borderRadius: 12,
  },
});

export default FavoriteBooks;
