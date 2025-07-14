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
import CategoryListScreen from "./category-list/[genre]";
import { FavoritesProvider } from "@/components/FavoritesContext";

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

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
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
            </SignedIn>
            <SignedOut>
              <LoginScreen />
            </SignedOut>
            {/* Ensure that the StatusBar is always visible */}
          </ThemeProvider>
        </SearchResultsProvider>
      </FavoritesProvider>
    </ClerkProvider>
  );
}
