import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <Pressable
          onPress={() => router.push("/(tabs)/home")}
          style={{
            marginBottom: 50,
            backgroundColor: Colors.PRIMARY,
            padding: 20,
            borderRadius: 30,
          }}
        >
          <Text>Haydi Başlayalım</Text>
        </Pressable>
      </View>
    </View>
  );
}
