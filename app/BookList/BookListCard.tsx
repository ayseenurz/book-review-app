import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Kitap bilgisini prop olarak alacak şekilde düzenlendi
type BookListCardProps = {
  book: any;
};

const BookListCard: React.FC<BookListCardProps> = ({ book }) => {
  const router = useRouter();
  /*console.log("BookListCard book:", JSON.stringify(book));*/
  // Eğer volumeInfo yoksa book'un kendisini kullan
  const volume = book.volumeInfo || book;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/book-detail/${book.id}`)}
      >
        {volume.imageLinks?.thumbnail && (
          <Image
            source={{ uri: volume.imageLinks.thumbnail }}
            style={styles.image}
          />
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{volume.title}</Text>
          {volume.authors && (
            <Text style={styles.authors}>{volume.authors.join(", ")}</Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BookListCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#222",
  },
  authors: {
    color: "#666",
    fontSize: 14,
  },
});
