import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, Pressable } from 'react-native';

interface CommentListCardProps {
  comment: {
    id: string;
    comment: string;
    rating?: number;
    createdAt?: any;
    bookId?: string;
    userName?: string;
  };
  onDelete?: (id: string) => void; // Optional, for parent to handle delete
}

const CommentListCard: React.FC<CommentListCardProps> = ({ comment, onDelete }) => {
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBookTitle = async () => {
      if (!comment.bookId) return;
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${comment.bookId}`);
        const data = await res.json();
        setBookTitle(data?.volumeInfo?.title || null);
      } catch {
        setBookTitle(null);
      }
    };
    fetchBookTitle();
  }, [comment.bookId]);

  const handleDelete = () => {
    setModalVisible(false);
    if (onDelete) {
      onDelete(comment.id);
    }
    // If you want to handle delete here, you can add logic (e.g. Firestore silme)
  };

  return (
    <View style={styles.card}>
      {/* Çöp kutusu iconu sağ üstte */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setModalVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={require('@/assets/icons/trash.png')}
          style={styles.trashIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {bookTitle ? (
        <Text style={styles.bookTitle}>{bookTitle}</Text>
      ) : null}
      <Text style={styles.text}>{comment.comment}</Text>
      {comment.rating !== undefined && comment.rating !== null ? (
        <Text style={styles.rating}>
          <Text>Puan: </Text>
          <Text>{comment.rating}</Text>
        </Text>
      ) : null}
      {comment.createdAt?.toDate ? (
        <Text style={styles.date}>
          {comment.createdAt.toDate().toLocaleString('tr-TR')}
        </Text>
      ) : null}

      {/* Silme modalı */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yorumu Sil</Text>
            <Text style={styles.modalText}>Bu yorumu silmek istediğinize emin misiniz?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonTextCancel}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonDelete} onPress={handleDelete}>
                <Text style={styles.modalButtonTextDelete}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CommentListCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
  },
  trashIcon: {
    width: 22,
    height: 22,
    tintColor: '#c0392b',
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6c584c',
    marginBottom: 4,
    paddingRight: 28, // çöp kutusu ile çakışmasın
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#6c584c',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c584c',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalButtonCancel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  modalButtonDelete: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#c0392b',
  },
  modalButtonTextCancel: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalButtonTextDelete: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});