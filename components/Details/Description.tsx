import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DescriptionProps {
  description: string;
}

const MAX_LINES = 4;

const Description: React.FC<DescriptionProps> = ({ description = "" }) => {
  const [expanded, setExpanded] = useState(false);

  const safeDescription = description || "";
  // Eğer açıklama kısa ise buton gösterme
  const shouldShowReadMore = safeDescription.split(' ').length > 20 || safeDescription.length > 120;

  return (
    <View style={styles.descBox}>
        <Text style={styles.title}>Açıklama</Text>
      <Text
        style={styles.description}
        numberOfLines={expanded ? undefined : MAX_LINES}
      >
        {description}
      </Text>
      {shouldShowReadMore && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? 'Daha az göster' : 'Devamını oku'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  descBox: {
    backgroundColor: Colors.light.acikKrem,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.koyuKahverengi,
    margin: 10,
    padding: 14,
    minHeight: 100,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flexGrow: 1,
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "left",
  },
  readMore: {
    color: Colors.light.koyuKahverengi,
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "right",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.koyuKahverengi,
    textAlign: "left",
  },
});