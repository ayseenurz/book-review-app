import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RecentlyViewedBooksCard = ({ book }: { book: any }) => {
  if (!book) return null;

  const router = useRouter();
  const coverUrl = book.coverUrl || book.volumeInfo?.imageLinks?.thumbnail;
  const title = book.title || book.volumeInfo?.title || 'Bilinmeyen Başlık';
  const author = book.author || (book.volumeInfo?.authors ? book.volumeInfo.authors.join(', ') : null);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/book-detail/${book.id}`)}
    >
      <View style={styles.row}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Text style={styles.placeholderText}>Kapak Yok</Text>
          </View>
        )}
        <View style={styles.infoBox}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {author && <Text style={styles.author} numberOfLines={1}>{author}</Text>}
        </View>
      </View>

      {/* Sağ alt köşe kat efekti */}
      <View style={styles.foldBox}>
        <View style={styles.foldTriangle} />
      </View>
    </TouchableOpacity>
  );
};

export default RecentlyViewedBooksCard;

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#FFFBF9', 
    borderRadius: 12,
    borderWidth:1,
    borderBottomRightRadius:50,
    padding: 10,
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#e0d6c8',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
  },
  infoBox: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e4339',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#7a6b5b',
  },
  foldBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopLeftRadius:12,
    backgroundColor: '#7a6b5b', 
  },
  foldTriangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: 'transparent',
    borderRightWidth: 40,
    borderRightColor: '#FFFBF9', 
  },
});
