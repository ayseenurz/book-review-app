import CustomToast from "@/components/CustomToast";
import { FavoritesProvider } from "@/components/FavoritesContext";
import LoginScreen from "@/components/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import "react-native-reanimated";
import { RecentlyViewedBooksProvider } from "../components/RecentlyViewedBooksContext";
import { SearchResultsProvider } from "../components/SearchResultsContext";
import { HomeDataProvider } from "../contexts/HomeDataContext";
import { useColorScheme } from "../hooks/useColorScheme";

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
            <RecentlyViewedBooksProvider>
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
            </RecentlyViewedBooksProvider>
          </SearchResultsProvider>
        </FavoritesProvider>
      </HomeDataProvider>
    </ClerkProvider>
  );
}
