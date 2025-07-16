import LoadingScreen from "@/components/LoadingScreen";
import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BookListCard from "../BookList/BookListCard";

const Bookmark = () => {
  const { isLoaded, isSignedIn, user } = useUser();
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
      <View style={styles.header}>
        <Text style={styles.title}>Favori Kitaplarım</Text>
        <Text style={styles.count}>
          Toplamda <Text style={styles.countNumber}>{bookDetails.length}</Text>{" "}
          kitap favorilere eklenmiş.
        </Text>
      </View>

      {!isLoaded || !isSignedIn ? (
        <Text style={styles.infoText}>
          Favori kitaplarınızı görmek için giriş yapmalısınız.
        </Text>
      ) : loading ? (
        <LoadingScreen />
      ) : bookDetails.length === 0 ? (
        <Text style={styles.infoText}>
          Henüz favorilere kitap eklemediniz. 🌱
        </Text>
      ) : (
        <FlatList
          data={bookDetails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <BookListCard book={item} />
            </View>
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
  },
  header: {
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4e342e",
  },
  count: {
    fontSize: 14,
    color: "#6c584c",
    marginTop: 4,
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
  cardWrapper: {
    marginVertical: 8,
    borderRadius: 12,
  },
});

export default Bookmark;
