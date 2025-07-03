import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

interface IntroProps {
  title: string;
  author: string;
  description: string;
  thumbnail?: string;
}

const Intro: React.FC<IntroProps> = ({ title, author, description, thumbnail }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title || 'Başlıksız Kitap'}</Text>
          <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{author || 'Bilinmeyen Yazar'}</Text>
        </View>
        <Image
          source={thumbnail ? { uri: thumbnail } : require('@/assets/images/book-cover.png')}
          style={styles.image}
        />
      </View>
      {description ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={[styles.descBox, { flex: 1, minHeight: '50%' }]}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.description}>{description}</Text>
          </ScrollView>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

export default Intro

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.acikKrem,
    flex: 1,
  },
  cardWrapper: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 16,
    position: 'relative',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.light.koyuKahverengi,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 80, // üstte kitap kapağı için boşluk bırak
    paddingBottom: 24,
    paddingHorizontal: 16,
    height: 250,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#eee',
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.acikKrem,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.2,
    textShadowColor: '#222',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffe5b4',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  descBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    minHeight: 400,
    marginTop: 400,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flexGrow: 1,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'left',
  },
})