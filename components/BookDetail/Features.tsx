import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from "@/components/FavoritesContext";

interface FeaturesProps {
  volume: any;
}

const Features: React.FC<FeaturesProps> = ({ volume }) => {
  const { favoritesCounts } = useFavorites();

  if (!volume) return null;

  const favoriteCount = favoritesCounts[volume.id] || 0;

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Image source={require("@/assets/icons/calendar.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.text}>{volume.publishedDate}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.item}>
        <Image source={require("@/assets/icons/unchecked-bookmark.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.text}>{favoriteCount}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.item}>
        <Image source={require("@/assets/icons/world.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.text}>{volume.language?.toUpperCase()}</Text>
      </View>
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#FFFBF9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0D8CF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: "#6B4F27", // daha soft kahverengi tonu
  },
  text: {
    fontSize: 13,
    color: "#4B3832",
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#C8B7A6",
    marginHorizontal: 6,
    opacity: 0.5,
    borderRadius: 1,
  },
});
