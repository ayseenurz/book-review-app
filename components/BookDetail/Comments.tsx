import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface CommentsProps {
  bookId: string;
}

interface CommentItem {
  id: string;
  comment: string;
  rating: number;
  createdAt: any;
  userId: string;
  userName: string;
}

const Comments: React.FC<CommentsProps> = ({ bookId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(3); 
  const { user } = useUser();
  const sendAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("bookId", "==", bookId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as CommentItem)
        )
      );
      setVisibleCount(3); 
    });
    return unsubscribe;
  }, [bookId]);

  const handleSend = async () => {
    if (!comment.trim() || !user) {
      return;
    }
    Animated.sequence([
      Animated.timing(sendAnim, { toValue: 50, duration: 250, useNativeDriver: true }),
      Animated.timing(sendAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
    try {
      await addDoc(collection(db, "comments"), {
        comment,
        rating,
        createdAt: serverTimestamp(),
        userId: user.id,
        userName: user.fullName,
        bookId,
      });
      setComment("");
      setRating(0);
    } catch (e) {
      let errorMsg = "Bilinmeyen hata";
      if (typeof e === "object" && e !== null && "message" in e) {
        errorMsg = (e as any).message;
      } else {
        errorMsg = String(e);
      }
      Alert.alert("Yorum gönderilemedi", errorMsg);
    }
  };

  const handleDelete = async (commentId: string) => {
    Alert.alert(
      "Yorumu Sil",
      "Yorumu silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "comments", commentId));
              setComments(prev => prev.filter(c => c.id !== commentId));
            } catch (e) {
              let errorMsg = "Bilinmeyen hata";
              if (typeof e === "object" && e !== null && "message" in e) {
                errorMsg = (e as any).message;
              } else {
                errorMsg = String(e);
              }
              Alert.alert("Yorum silinemedi", errorMsg);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#6B4F27",
          marginBottom: 8,
        }}
      >
        Yorumlar
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Yorumunuzu yazın..."
        />
        <TouchableOpacity onPress={handleSend}>
          <Animated.View style={{ transform: [{ translateX: sendAnim }] }}>
            <Image
              source={require("@/assets/icons/message.png")}
              style={styles.sendButton}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={styles.ratingRow}>
        <Text>Puan:</Text>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Text style={rating === num ? styles.selectedStar : styles.star}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={comments.slice(0, visibleCount)} // sadece visibleCount kadar göstermek için
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.commentUser}>{item.userName}</Text>
                <Text style={styles.commentDate}>
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString()
                    : ""}
                </Text>
              </View>
              {/* sadece kendi yorumunda çöp kutusu göstermek için */}
              {user?.id === item.userId && (
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.trashButton}
                  accessibilityLabel="Yorumu Sil"
                >
                  <Image
                    source={require("@/assets/icons/trash.png")}
                    style={styles.trashIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Text
                  key={num}
                  style={num <= item.rating ? styles.selectedStar : styles.star}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
        style={styles.commentsList}
        ListEmptyComponent={
          <Text style={{ color: "#888", marginTop: 8 }}>Henüz yorum yok.</Text>
        }
        ListFooterComponent={
          comments.length > 5 ? (
            <TouchableOpacity
              onPress={() => setVisibleCount(visibleCount === comments.length ? 5 : comments.length)}
              style={{ alignItems: 'center', marginVertical: 12 }}
            >
              <Text style={{ color: '#6c584c', fontWeight: 'bold', fontSize: 16 }}>
                {visibleCount === comments.length ? 'Daha az göster' : 'Daha fazla göster'}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingHorizontal: 16,     // içeride yatay padding
    backgroundColor: "#FFFBF9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0D8CF",
    marginHorizontal: 16,     // dışarıdan kenar boşluğu
    marginTop: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D8CFC4",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#FDF9F6",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 2,
  },
  star: {
    fontSize: 20,
    color: "#ccc",
    marginHorizontal: 1,
  },
  selectedStar: {
    fontSize: 20,
    color: "#f5a623",
    marginHorizontal: 1,
  },
  commentsList: {
    marginTop: 6,
  },
  commentItem: {
    backgroundColor: "#FDF9F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6DED4",
    padding: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  commentUser: {
    fontWeight: "600",
    marginRight: 6,
    color: "#4B3832",
    fontSize: 13,
  },
  commentDate: {
    color: "#9A8C82",
    fontSize: 11,
  },
  commentText: {
    marginTop: 4,
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  sendButton: {
    width: 22,
    height: 22,
    tintColor: "#6B4F27",
  },
  trashButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "#B71C1C",
  },
});

export default Comments;
