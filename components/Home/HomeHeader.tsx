import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  const { user } = useUser();
  return (
    <View style={styles.headerWrapper}>
      <View>
        <Text style={styles.greetingText}>
          Hoşgeldin{user?.firstName ? `, ${user.firstName}` : ""}
        </Text>
        <Text style={styles.subText}>Bugün hangi kitabı keşfetmek istersin?</Text>
      </View>
      <View style={styles.appNameBox}>
        <Text style={styles.appNameTop}>Kitap</Text>
        <Text style={styles.appNameBottom}>lar</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 12,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: 14,
    color: "#6c584c",
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  appNameBox: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingLeft: 16,
  },
  appNameTop: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.light.koyuKahverengi,
    letterSpacing: 1.2,
    lineHeight: 38,
  },
  appNameBottom: {
    fontSize: 28,
    fontWeight: "600",
    color: "#a98467",
    letterSpacing: 1.1,
    lineHeight: 30,
    marginTop: -6,
  },
});
