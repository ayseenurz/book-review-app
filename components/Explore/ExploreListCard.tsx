import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ExploreListCardProps {
  genre: string;
  onPress: () => void;
  color?: string;
  image?: any;
  index?: number;
}

const defaultColors = [
  '#7a6f63', // muted brown
  '#c2b6a3', // light beige
  '#4b3f2f', // deep brown (dark academia base)
  '#a3917b', // taupe brown
  '#b7b7a4', // sage gray
  '#85586f', // muted plum (dark academia accent)
  '#e0b084', // pale ochre
  '#6c584c', // olive brown
  '#a89984', // warm gray
  '#e6ccb2', // soft tan (dark academia, replaces previous green)
];

const ExploreListCard: React.FC<ExploreListCardProps> = ({ genre, onPress, color, image, index }) => {
  const bgColor = color || (typeof index === 'number' ? defaultColors[index % defaultColors.length] : '#f5f5f5');
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bgColor }]} onPress={onPress}>
      {image && <Image source={image} style={styles.icon} />}
      <Text style={styles.text}>{genre}</Text>
    </TouchableOpacity>
  )
}

export default ExploreListCard

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 200,
    width: 180,
    margin: 16,
    backgroundColor: Colors.light.acikKrem,
    paddingVertical: 28,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  icon: {
    width: 36,
    height: 36,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    fontWeight: '400',
    color: Colors.light.acikKrem,
  },
})