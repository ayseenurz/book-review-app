import { fetchAuthorImage } from "@/services/fetchAuthorImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Books from "../../components/Author/Books";
import Details from "../../components/Author/Details";
import Header from "../../components/Author/Header";
import LoadingScreen from "../../components/LoadingScreen";

const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 120;

const Detail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const authorid = typeof params.authorid === "string" ? params.authorid : "";
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorImage, setAuthorImage] = useState<string | null | undefined>(
    undefined
  );

  const scrollY = useRef(new Animated.Value(0)).current;

  const animatedHeight = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [
      HEADER_MAX_HEIGHT + 100,
      HEADER_MAX_HEIGHT,
      HEADER_MIN_HEIGHT,
    ],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (!authorid) return;
    setAuthorLoading(true);
    fetch(
      `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
        authorid
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          setAuthorInfo(data.docs[0]);
        } else {
          setAuthorInfo(null);
        }
      })
      .catch(() => setAuthorInfo(null))
      .finally(() => setTimeout(() => setAuthorLoading(false), 1000));
  }, [authorid]);

  useEffect(() => {
    if (authorid) {
      console.log("Yazar ID param:", authorid);
    }
  }, [authorid]);

  useEffect(() => {
    if (authorInfo && authorInfo.key) {
      console.log("OpenLibrary Yazar ID:", authorInfo.key);
    }
  }, [authorInfo]);

  useEffect(() => {
    const getAuthorImage = async () => {
      if (authorInfo && authorInfo.key) {
        const id = authorInfo.key.replace("/authors/", "");
        const image = await fetchAuthorImage(id);
        setAuthorImage(image);
      }
    };
    getAuthorImage();
  }, [authorInfo]);

  return (
    <View style={styles.container}>
      {authorImage !== undefined && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
        >
          <Header animatedHeight={animatedHeight} imageUrl={authorImage} />
        </MotiView>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require("../../assets/icons/back.png")}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Animated.ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {authorLoading ? (
          <LoadingScreen />
        ) : authorInfo ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={styles.authorBox}
          >
            <Details author={authorInfo} />
            <Books author={authorInfo} />
          </MotiView>
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
    backgroundColor: "#FFFBF9",
  },
  backButton: {
    position: "absolute",
    top: 44,
    left: 18,
    zIndex: 10,
    borderRadius: 20,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2eee9",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backIcon: {
    width: 26,
    height: 26,
    tintColor: "#6B4F27",
  },
  authorBox: {
    width: "100%",
    paddingBottom: 12,
    marginBottom: 16,
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  authorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
});
