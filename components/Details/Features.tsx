import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface FeaturesProps {
  volume: any;
}

const Features: React.FC<FeaturesProps> = ({ volume }) => {
  if (!volume) return null;
  return (
    <View style={styles.container}>
      {volume.publishedDate && (
        <Text style={styles.feature}><Text style={styles.label}>Basım Yılı:</Text> {volume.publishedDate}</Text>
      )}
      {volume.publisher && (
        <Text style={styles.feature}><Text style={styles.label}>Basımevi:</Text> {volume.publisher}</Text>
      )}
      {volume.pageCount && (
        <Text style={styles.feature}><Text style={styles.label}>Sayfa Sayısı:</Text> {volume.pageCount}</Text>
      )}
      {volume.language && (
        <Text style={styles.feature}><Text style={styles.label}>Dil:</Text> {volume.language.toUpperCase()}</Text>
      )}
      {volume.infoLink && (
        <TouchableOpacity onPress={() => Linking.openURL(volume.infoLink)}>
          <Text style={styles.link}>Google Books'ta Görüntüle</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Features

const styles = StyleSheet.create({
  container: {
    marginTop: 350,
    backgroundColor: Colors.light.acikKrem,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  feature: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#6c584c',
  },
  link: {
    color: '#85586f',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
})