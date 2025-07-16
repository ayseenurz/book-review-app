import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import BookListCard from './BookListCard'

interface BookListProps {
  books?: any[]
  contextLabel?: string 
}

const BookList: React.FC<BookListProps> = ({ books = [], contextLabel }) => {
  if (!books.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={56} color="#c2b6a3" style={{ marginBottom: 12 }} />
        <Text style={styles.emptyText}>
          {contextLabel ? `${contextLabel} bulunamadı.` : "Hiç kitap bulunamadı."}
        </Text>
        <Text style={styles.suggestion}>
          {contextLabel
            ? contextLabel === "Arama Sonuçları"
              ? "Aramanıza uygun kitap bulunamadı. Farklı bir anahtar kelime deneyin."
              : "Yeni kitaplar ekleyin veya arama yapın."
            : "Yeni kitaplar ekleyin veya arama yapın."
          }
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.listContainer}>
      {contextLabel && (
        <Text style={styles.resultLabel}>
          {contextLabel} ({books.length} kitap)
        </Text>
      )}
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BookListCard book={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default BookList

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f6f2',
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f6f2',
    borderRadius: 16,
    margin: 16,
  },
  emptyText: {
    color: '#a3917b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  suggestion: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c584c',
    marginBottom: 8,
    marginLeft: 4,
  },
})