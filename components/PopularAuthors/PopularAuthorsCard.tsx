import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AuthorCardProps {
  name: string;
  backgroundColor?: string; // dışarıdan opsiyonel renk al
}

const PopularAuthorsCard: React.FC<AuthorCardProps> = ({ name, backgroundColor = "#f5f5f5" }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={() => router.push(`/search/${encodeURIComponent(name)}`)}
    >
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default PopularAuthorsCard;
