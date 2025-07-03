import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const AuthorDetail = () => {
  const params = useLocalSearchParams();
  const authorid = typeof params.authorid === 'string' ? params.authorid : '';
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [authorLoading, setAuthorLoading] = useState(true);

  // OpenLibrary'den yazar bilgisi çek
  useEffect(() => {
    if (!authorid) return;
    setAuthorLoading(true);
    fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorid)}`)
      .then(res => res.json())
      .then(data => {
        if (data.docs && data.docs.length > 0) {
          setAuthorInfo(data.docs[0]);
        } else {
          setAuthorInfo(null);
        }
      })
      .catch(() => setAuthorInfo(null))
      .finally(() => setAuthorLoading(false));
  }, [authorid]);

  return (
    <View style={styles.container}>
      {authorLoading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : authorInfo ? (
        <View style={styles.authorBox}>
          {authorInfo.key && (
            <Image
              source={{ uri: `https://covers.openlibrary.org/b/author/${authorInfo.key.replace('/authors/', '')}-L.jpg` }}
              style={styles.authorImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.authorName}>{authorInfo.name}</Text>
        </View>
      ) : (
        <Text style={styles.empty}>Yazar bilgisi bulunamadı.</Text>
      )}
    </View>
  );
};

export default AuthorDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f2',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  authorImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 14,
    backgroundColor: '#eee',
  },
  authorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c584c',
    marginBottom: 6,
    textAlign: 'center',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});
