import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SearchResultsProvider } from "../components/SearchResultsContext";
import { useColorScheme } from "../hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import LoginScreen from "@/components/LoginScreen";
import CustomToast from "@/components/CustomToast";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { useState } from "react";
import { HomeDataProvider } from "./(tabs)/contexts/HomeDataContext";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [toastVisible, setToastVisible] = useState(false);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <HomeDataProvider>
        <FavoritesProvider>
          <SearchResultsProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <SignedIn>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="index" />
                  <Stack.Screen name="category-list/[genre]" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />

                <CustomToast visible={toastVisible} message="İşlem başarılı!" />
              </SignedIn>
              <SignedOut>
                <LoginScreen />
              </SignedOut>
            </ThemeProvider>
          </SearchResultsProvider>
        </FavoritesProvider>
      </HomeDataProvider>
    </ClerkProvider>
  );
}
