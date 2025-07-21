import React, { useState } from "react";
import {
  Dimensions,
  Text,
  View,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import FavoriteAuthors from "../Favorites/FavoriteAuthors";
import FavoriteBooks from "../Favorites/FavoriteBooks";

const initialLayout = { width: Dimensions.get("window").width };

export default function Bookmark() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "books", title: "Kitaplar" },
    { key: "authors", title: "Yazarlar" },
  ]);

  const renderScene = SceneMap({
    books: FavoriteBooks,
    authors: FavoriteAuthors,
  });

  const renderLabel = ({
    route,
    focused,
    color,
  }: {
    route: { title: string };
    focused: boolean;
    color: string;
  }) => (
    <Text
      style={{
        color: focused ? "#6B4F27" : "#a3917b",
        fontWeight: "bold",
        fontSize: 16,
      }}
    >
      {route.title}
    </Text>
  );

  const options = {
    books: {
      label: renderLabel,
    },
    authors: {
      label: renderLabel,
    },
  };

  const topInset =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 32;
  const bottomInset = 24;

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: topInset, paddingBottom: bottomInset },
      ]}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        options={options}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#6B4F27" }}
            style={{ backgroundColor: "#fff" }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFBF9",
  },
});
