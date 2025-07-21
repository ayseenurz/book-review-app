import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const READING_LIST_KEY = "READING_LIST";

interface ReadingListButtonProps {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
}

const ReadingListButton: React.FC<ReadingListButtonProps> = ({
  id,
  title,
  authors,
  thumbnail,
  publishedDate,
}) => {
  const [inReadingList, setInReadingList] = useState(false);

  useEffect(() => {
    const checkInList = async () => {
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      setInReadingList(list.some((b: any) => b.id === id));
    };
    checkInList();
  }, [id]);

  const handleAddToReadingList = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      if (!list.some((b: any) => b.id === id)) {
        list.push({ id, title, authors, coverUrl: thumbnail, publishedDate });
        await AsyncStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
        setInReadingList(true);
      }
    } catch (e) {}
  };

  const handleRemoveFromReadingList = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const json = await AsyncStorage.getItem(READING_LIST_KEY);
      let list = json ? JSON.parse(json) : [];
      list = list.filter((b: any) => b.id !== id);
      await AsyncStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
      setInReadingList(false);
    } catch (e) {}
  };

  return inReadingList ? (
    <TouchableOpacity
      onPress={handleRemoveFromReadingList}
      style={styles.readingIconButton}
    >
      <Feather name="check" size={20} color="#6B4F27" />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddToReadingList}
      style={styles.readingIconButton}
    >
      <Feather name="plus" size={20} color="#6B4F27" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  readingIconButton: {
    backgroundColor: "#f2eee9",
    borderRadius: 14,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginLeft: 8,
    opacity: 0.5,
  },
});

export default ReadingListButton;
