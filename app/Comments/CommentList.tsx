import { db } from "@/configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CommentListCard from "./CommentListCard";

interface CommentListProps {
  userId: string;
}

const CommentList: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const safeTop = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;
  const safeBottom = Platform.OS === "ios" ? 24 : 16;

  React.useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "comments"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(data);
      } catch (err: any) {
        setError(err?.message || "Yorumlar yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchComments();
  }, [userId]);

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Giriş yapmalısınız.</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Yükleniyor...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.infoText, { color: "red" }]}>{error}</Text>
      </View>
    );
  }
  if (!comments.length) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("@/assets/icons/message.png")}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>Henüz hiç yorum yapmadınız.</Text>
        <Text style={styles.emptySubText}>
          Kitaplara yorum ekleyerek burada görebilirsiniz.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pageContainer,
        { paddingTop: safeTop, paddingBottom: safeBottom },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable style={styles.backIconWrapper} onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/back.png")}
            style={styles.backIcon}
          />
        </Pressable>
      </View>
      <View style={styles.header}>
        <Image
          source={require("@/assets/icons/message.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Yorumlarım</Text>
        <Text style={styles.headerSubtitle}>{comments.length} yorum</Text>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentListCard comment={item} />}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommentList;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#FFFBF9",
  },
  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    marginTop: 8,
  },
  backIconWrapper: {
    padding: 4,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: "#6c584c",
  },
  header: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    tintColor: "#6c584c",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6c584c",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#a3917b",
    marginBottom: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFBF9",
    padding: 24,
  },
  infoText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFBF9",
    padding: 32,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    tintColor: "#c2b6a3",
  },
  emptyText: {
    fontSize: 18,
    color: "#6c584c",
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 15,
    color: "#a3917b",
    textAlign: "center",
  },
});
