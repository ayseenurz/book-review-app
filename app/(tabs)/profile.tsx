import { Colors } from '@/constants/Colors';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Profile = () => {
  const {user} = useUser();
  const {signOut} = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istiyor musunuz?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: () => signOut() }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Image source={require('@/assets/images/logout.png')} style={styles.logoutButtonIcon} resizeMode='contain' />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
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
      <View style={styles.footerTag}>
        <Text style={styles.footerText}>Ⓒ 2025</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFFBF9",
    paddingTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 80,
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
  footerTag: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.3,
  },
  footerText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
})

export default Profile