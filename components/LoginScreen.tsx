import { fetchAllHomeData } from "@/services/fetchAllHomeData";
import { useOAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useHomeData } from "../contexts/HomeDataContext";
import useWarmUpBrowser from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { setHomeData } = useHomeData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        const data = await fetchAllHomeData();
        setHomeData(data);
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow, setHomeData]);

  return (
    <LinearGradient
      colors={["#f7f7f7", "#fff8f0", '#c2b6a3']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <LottieView
          source={require("../assets/animations/loading-books.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titlePrimary}>Kitap</Text>
            <Text style={styles.titleSecondary}>lar</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Yeni kitaplar keşfetmek ister misin?
        </Text>

        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, loading && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Image
            source={require("../assets/icons/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 16 }}
            size="large"
            color="#6c584c"
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  titleContainer:{
    marginBottom:30
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 8,
    width: "100%",
  },
  titlePrimary: {
    fontSize: 54,
    fontWeight: "900",
    color: "#4e4339",
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleSecondary: {
    fontSize: 54,
    fontWeight: "900",
    color: "#a18262",
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#a18262",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 150,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: "#4e4339",
    fontWeight: "bold",
    fontSize: 18,
  },
});
