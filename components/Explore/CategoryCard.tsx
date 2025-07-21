import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { MotiView } from "moti";

interface CategoryCardProps {
  genre: string;
  onPress: () => void;
  color?: string;
  image?: any;
  index?: number;
  compact?: boolean;
  cardHeight?: number;
  cardWidth?: number;
  style?: ViewStyle;
  hideGenreName?: boolean;
  animationAxis?: "x" | "y";
}

const defaultColors = [
  "#7a6f63",
  "#c2b6a3",
  "#4b3f2f",
  "#a3917b",
  "#b7b7a4",
  "#85586f",
  "#e0b084",
  "#6c584c",
  "#a89984",
  "#e6ccb2",
];

const CategoryCard: React.FC<CategoryCardProps> = ({
  genre,
  onPress,
  color,
  image,
  index,
  compact,
  cardHeight,
  cardWidth,
  style,
  hideGenreName,
  animationAxis = "y", // default y ekseni
}) => {
  const bgColor =
    color ||
    (typeof index === "number"
      ? defaultColors[index % defaultColors.length]
      : "#f5f5f5");

  const from =
    animationAxis === "x"
      ? { opacity: 0, translateX: 50 }
      : { opacity: 0, translateY: 50 };
  const animate =
    animationAxis === "x"
      ? { opacity: 1, translateX: 0 }
      : { opacity: 1, translateY: 0 };

  return (
    <MotiView
      from={from}
      animate={animate}
      transition={{
        type: "timing",
        duration: 500,
        delay: (index || 0) * 100,
      }}
    >
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: bgColor },
          compact && styles.compact,
          cardHeight ? { height: cardHeight } : {},
          cardWidth ? { width: cardWidth } : {},
          style,
        ]}
        onPress={onPress}
      >
        {image && <Image source={image} style={styles.icon} />}
        {!hideGenreName && <Text style={styles.text}>{genre}</Text>}
      </TouchableOpacity>
    </MotiView>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: 160,
    margin: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  compact: {
    padding: 4,
  },
  icon: {
    width: 36,
    height: 36,
    marginBottom: 8,
    resizeMode: "contain",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.light.acikKrem,
    textAlign: "center",
  },
});
