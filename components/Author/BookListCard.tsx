import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BookListCard = ({ book }: { book: any }) => {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;
  const authors = volumeInfo.authors?.join(', ');

  return (
    <View style={styles.card}>
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text style={styles.placeholderText}>Kapak Yok</Text>
        </View>
      )}
      <Text numberOfLines={2} style={styles.title}>{volumeInfo.title}</Text>
      {authors && <Text numberOfLines={1} style={styles.authors}>{authors}</Text>}
      {volumeInfo.description && (
        <Text numberOfLines={2} style={styles.description}>{volumeInfo.description}</Text>
      )}
    </View>
  );
};

export default BookListCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginBottom: 6,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  authors: {
    fontSize: 12,
    color: '#777',
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
});
