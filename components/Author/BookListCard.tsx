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
      <View style={styles.infoBox}>
        <Text numberOfLines={2} style={styles.title}>{volumeInfo.title}</Text>
        {authors && <Text numberOfLines={1} style={styles.authors}>{authors}</Text>}
        {volumeInfo.description && (
          <Text numberOfLines={2} style={styles.description}>{volumeInfo.description}</Text>
        )}
      </View>
    </View>
  );
};

export default BookListCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFFBF9',  // soft açık krem
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: '#eae4dc',
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
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3e372f',
    marginBottom: 2,
  },
  authors: {
    fontSize: 12,
    color: '#6c584c',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    color: '#555',
  },
});
