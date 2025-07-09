import { Colors } from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Profile = () => {
  const {user} = useUser()

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut(auth)}>
        <Image source={require('@/assets/images/logout.png')} style={styles.logoutButtonIcon} resizeMode='contain' />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit')}>
          <Text style={styles.editButtonText}>Profili Düzenle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{12}</Text>
          <Text style={styles.statLabel}>Kitap</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{5}</Text>
          <Text style={styles.statLabel}>Favoriler</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{8}</Text>
          <Text style={styles.statLabel}>Yorum</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: Colors.light.koyuKahverengi,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  logoutButtonIcon: {
    width: 24,
    height: 24,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    padding: 8,
    zIndex: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
})

export default Profile