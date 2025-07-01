import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface IntroProps {
  title: string;
  author: string;
  description: string;
  thumbnail?: string;
}

const Intro: React.FC<IntroProps> = ({ title, author, description, thumbnail }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={thumbnail ? { uri: thumbnail } : require('@/assets/images/book-cover.png')}
          style={styles.image}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  )
}

export default Intro

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.dark.koyuKahverengi,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
})