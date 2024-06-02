import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export default function ChatDetailPage({ route }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  // Diğer kullanıcının ID'si
  const otherUserId = route.params.userId;

  // Conversation ID oluşturma (örneğin, kullanıcı ID'lerini sıralı bir şekilde birleştirerek)
  const conversationId = [auth.currentUser.uid, otherUserId].sort().join('_');

  useEffect(() => {
    // Mesajları dinleme ve güncelleme
    const unsubscribe = onSnapshot(
      query(collection(db, 'messages', conversationId, 'messages'), orderBy('timestamp', 'asc')),
      (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(newMessages);
      }
    );
    return unsubscribe; // Component unmount olduğunda dinlemeyi durdur
  }, []);

  const handleSend = async () => {
    if (message.trim() !== '') {
      try {
        // Mesajı Firestore'a kaydet
        await addDoc(collection(db, 'messages', conversationId, 'messages'), {
          senderId: auth.currentUser.uid,
          text: message,
          timestamp: new Date(),
        });

        // Sohbet listesini güncelle (lastMessage ve lastMessageTime)
        await db.collection('conversations').doc(conversationId).set({
          members: [auth.currentUser.uid, otherUserId],
          lastMessage: message,
          lastMessageTime: new Date(),
        }, { merge: true }); // Sadece belirtilen alanları güncelle

        setMessage('');
      } catch (error) {
        console.error("Mesaj gönderme hatası:", error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View
      key={item.id}
      style={[
        styles.message,
        item.senderId === auth.currentUser.uid ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={[styles.messageText, item.senderId === auth.currentUser.uid && { color: '#fff' }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajınızı yazın..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  messageContainer: {
    flexGrow: 1,
    paddingVertical: 80,
  },
  message: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%', // Mesaj balonu genişliği !!
    alignSelf: 'flex-start', // Kullanıcıya göre hizalama !!
  },
  myMessage: {
    alignSelf: 'flex-end', // Kendi mesajlarımızın sağa hizalama !!
    backgroundColor: '#D30455', // Kendi mesajlarımızın arkaplan rengi !!!
  },
  theirMessage: {
    backgroundColor: '#fff', // Karşı tarafın mesajlarının arkaplan rengi  !!
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#D30455',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
