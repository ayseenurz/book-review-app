import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

// This is the layout for the tab navigation in the app.
// It defines the tab bar and the screens that will be displayed in each tab.

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.koyuKahverengi,
        tabBarInactiveTintColor: Colors.light.kahverengi,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "#FFFBFA",
          borderTopWidth: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopColor: "#501a03",
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 20,
          height: "10%",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <IconSymbol name="house.fill" color={focused ? Colors.light.koyuKahverengi : Colors.light.kahverengi} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <IconSymbol name="magnifyingglass" color={focused ? Colors.light.koyuKahverengi : Colors.light.kahverengi} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <IconSymbol name="bookmark.fill" color={focused ? Colors.light.koyuKahverengi : Colors.light.kahverengi} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <IconSymbol name="person.fill" color={focused ? Colors.light.koyuKahverengi : Colors.light.kahverengi} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
