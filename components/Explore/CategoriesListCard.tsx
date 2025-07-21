import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type CategoriesListCardProps = {
  title: string;
  authors?: string[];
  thumbnail?: string;
};

const CategoriesListCard: React.FC<CategoriesListCardProps> = ({
  title,
  authors,
  thumbnail,
}) => {
  return (
    <View style={styles.card}>
      {thumbnail && (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {authors && (
          <Text style={styles.authors} numberOfLines={1}>
            {authors.join(", ")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CategoriesListCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: 50,
    height: 75,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  authors: {
    fontSize: 14,
    color: "#666",
  },
});
