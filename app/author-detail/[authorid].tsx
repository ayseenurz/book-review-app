import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Books from '../../components/Author/Books';
import Details from '../../components/Author/Details';
import Header from '../../components/Author/Header';

const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 120;

const Detail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const authorid = typeof params.authorid === 'string' ? params.authorid : '';
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [authorLoading, setAuthorLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;

  const animatedHeight = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [HEADER_MAX_HEIGHT + 100, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

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
      <Header animatedHeight={animatedHeight} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require('../../assets/icons/back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Animated.ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {authorLoading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : authorInfo ? (
          <View style={styles.authorBox}>
            <Details author={authorInfo} />
            <Books authorName={authorInfo.name} />
          </View>
        ) : (
          <Text style={styles.empty}>Yazar bilgisi bulunamadı.</Text>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 18,
    zIndex: 10,
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#6c584c',
  },
  authorBox: {
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});
