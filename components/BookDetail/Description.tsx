import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DescriptionProps {
  description: string;
}

const MAX_LINES = 4;

const Description: React.FC<DescriptionProps> = ({ description = "" }) => {
  const [expanded, setExpanded] = useState(false);

  // HTML taglerini temizlemek için
  const stripHtmlTags = (text: string) => text.replace(/<[^>]*>/g, '');

  const safeDescription = description || "";
  const shouldShowReadMore = safeDescription.split(' ').length > 20 || safeDescription.length > 120;

  const isEmpty = !safeDescription || stripHtmlTags(safeDescription).trim() === "";

  return (
    <View style={styles.descBox}>
      <Text style={styles.title}>Açıklama</Text>
      {isEmpty ? (
        <Text style={styles.description}>
          Bu yazara ait bir açıklama bulunamadı.
        </Text>
      ) : (
        <>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : MAX_LINES}
          >
            {stripHtmlTags(description)}
          </Text>
          {shouldShowReadMore && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={styles.readMore}>
                {expanded ? 'Daha az göster' : 'Devamını oku'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  descBox: {
    backgroundColor: "#FFFBF9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0D8CF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B4F27",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4B3832",
    lineHeight: 20,
    textAlign: "left",
  },
  readMore: {
    color: "#6B4F27",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
});
