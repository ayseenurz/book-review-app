import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Profil fotoğrafı seçme fonksiyonu (placeholder)
  const pickImage = async () => {
    // Burada expo-image-picker kullanılacak
    // setProfileImage(uri);
  };

  const handleSave = () => {
    // Burada güncelleme işlemleri yapılacak
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('@/assets/images/back.png')} style={styles.backButtonIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Profili Düzenle</Text>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
        )}
        <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
      </TouchableOpacity>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mevcut Şifre</Text>
          <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  changePhotoText: {
    color: '#4F8EF7',
    fontSize: 14,
  },
  form: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  saveButton: {
    backgroundColor: '#4F8EF7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});