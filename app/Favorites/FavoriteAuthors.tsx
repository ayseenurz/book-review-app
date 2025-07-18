import { useFavorites } from '@/components/FavoritesContext';
import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import { deleteDoc, doc } from "firebase/firestore";
import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function FavoriteAuthors() {
  const { favoriteAuthors, setFavoriteAuthors } = useFavorites();
  const { user, isLoaded, isSignedIn } = useUser();
  const authors = Object.values(favoriteAuthors);
  const router = useRouter();

  // Helper: Try to get a valid author id for OpenLibrary search
  const getAuthorIdForDetail = (author: any) => {
    // Try id, authorId, key, name (as fallback)
    if (author.id) return author.id;
    if (author.authorId) return author.authorId;
    if (author.key) {
      // OpenLibrary keys are like "/authors/OL12345A", we want "OL12345A"
      const match = author.key.match(/OL\d+A/);
      if (match) return match[0];
      // fallback: remove leading "/authors/"
      if (author.key.startsWith("/authors/")) return author.key.replace("/authors/", "");
      return author.key;
    }
    if (author.name) return author.name;
    return "";
  };

  const removeFromFavorites = async (authorId: string) => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    try {
      await deleteDoc(doc(db, "Favorites", user.id, "authors", authorId));
      setFavoriteAuthors((prev) => {
        const copy = { ...prev };
        delete copy[authorId];
        return copy;
      });
    } catch (e) {
      Alert.alert("Hata", "Favorilerden çıkarılamadı.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favori Yazarlarım</Text>
      {authors.length > 0 && (
        <Text style={styles.count}>
          Toplamda <Text style={styles.countNumber}>{authors.length}</Text> yazar favorilenmiş.
        </Text>
      )}
      {authors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="feather" size={64} color="#a18262" />
          <Text style={styles.emptyText}>
            Henüz favori yazarın yok. {"\n"}Bir yazar eklemeye ne dersin?
          </Text>
        </View>
      ) : (
        <FlatList
          data={authors}
          keyExtractor={(item) => {
            return getAuthorIdForDetail(item);
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.authorCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (!item.name) {
                    Alert.alert("Hata", "Yazar ismi bulunamadı.");
                    return;
                  }
                  router.push(`/author-detail/${encodeURIComponent(item.name)}`);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>{item.name}</Text>
                  {item.top_work && (
                    <Text style={styles.topWorkText}>En bilinen eseri: {item.top_work}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={() => removeFromFavorites(getAuthorIdForDetail(item))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Image
                    source={require('@/assets/icons/checked-bookmark.png')}
                    style={styles.bookmarkIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF9',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#6B4F27',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 200,
    marginTop: 200, 
  },
  emptyText: {
    color: '#7a6b5b',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  authorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    color: '#3e2723',
  },
  topWorkText: {
    fontSize: 13,
    color: '#6c584c',
    marginTop: 2,
  },
  bookmarkButton: {
    marginLeft: 12,
    padding: 4,
  },
  bookmarkIcon: {
    width: 28,
    height: 28,
    tintColor: '#6B4F27',
  },
});
