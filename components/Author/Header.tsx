import { Colors } from "@/constants/Colors";
import React from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  animatedHeight: any;
  imageUrl?: string | null;
};

const Header = ({ animatedHeight, imageUrl }: Props) => (
  <Animated.Image
    source={
      imageUrl
        ? { uri: imageUrl }
        : require("../../assets/icons/author-placeholder.png")
    }
    style={[
      styles.authorImage,
      { height: animatedHeight, width }
    ]}
    resizeMode="cover"
  />
);

export default Header;

const styles = StyleSheet.create({
  authorImage: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.griKahve,
    borderStyle: "solid",
  },
});
