import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PopularAuthorsCard from "./PopularAuthorsCard";

interface PopularAuthorsProps {
  authors: string[];
}

const PopularAuthors: React.FC<PopularAuthorsProps> = ({ authors }) => {
  const colors = ["#a3917b", "#6c584c", "#c2b6a3", "#a89984", "#7a6f63"];

  if (!authors || authors.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popüler Yazarlar</Text>
      <View style={styles.contentContainer}>
        <FlatList
          data={authors}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 500,
                delay: index * 100,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push(`/author-detail/${encodeURIComponent(item)}`)
                }
              >
                <PopularAuthorsCard
                  name={item}
                  backgroundColor={colors[index % colors.length]}
                />
              </TouchableOpacity>
            </MotiView>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  title: {
    alignContent: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    margin: 14,
    color: Colors.light.koyuKahverengi,
  },
  contentContainer: {
    flex: 1,
  },
});

export default PopularAuthors;
