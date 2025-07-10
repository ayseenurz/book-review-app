import { Colors } from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface FeaturesProps {
  volume: any;
}

const Features: React.FC<FeaturesProps> = ({ volume }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log('isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'user:', user);
  if (!volume) return null;
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image source={require("@/assets/icons/calendar.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.iconText}>{volume.publishedDate}</Text>
      </View>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconSeparator}>|</Text>
        <Image source={require("@/assets/icons/bookmark.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.iconText}>count</Text>
      </View>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconSeparator}>|</Text>
        <Image source={require("@/assets/icons/world.png")} style={styles.icon} resizeMode="contain" />
        <Text style={styles.iconText}>{volume.language.toUpperCase()}</Text>
      </View>
    </View>
  )
}

export default Features

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.acikKrem,
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.light.koyuKahverengi,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  iconText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconSeparator: {
    fontSize: 24,
    color: Colors.light.koyuKahverengi,
  },
})