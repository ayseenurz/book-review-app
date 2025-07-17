import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
  const { user } = useUser();

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
    });
    return unsubscribe;
  }, [bookId]);

  const handleSend = async () => {
    if (!comment.trim() || !rating || !user) return;
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
          <Image
            source={require("@/assets/icons/message.png")}
            style={styles.sendButton}
            resizeMode="contain"
          />
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
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.commentUser}>{item.userName}</Text>
              <Text style={styles.commentDate}>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : ""}
              </Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", padding: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  star: { fontSize: 24, color: "#ccc", marginHorizontal: 2 },
  selectedStar: { fontSize: 24, color: "#f5a623", marginHorizontal: 2 },
  commentsList: { marginTop: 8 },
  commentItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  commentUser: { fontWeight: "bold", marginRight: 8 },
  commentDate: { color: "#888", fontSize: 12 },
  commentText: { marginTop: 4, fontSize: 15 },
  sendButton: { width: 24, height: 24 },
});

export default Comments;
