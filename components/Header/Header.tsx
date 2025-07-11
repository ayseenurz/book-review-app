import { Colors } from '@/constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const Header = () => {
  const {user} = useUser();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Hoşgeldin, {user?.firstName}
        </Text>
        <View style={styles.avatarContainer}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
        </View>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  headerContainer: {
    flexDirection:'row',justifyContent:'space-between', alignItems: 'flex-end', height: 72, padding:10, margin:12,
  },
  avatarContainer: {
    borderWidth:3,
    borderRadius:100,
    borderColor: Colors.light.koyuKahverengi
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 100
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi
  }
})