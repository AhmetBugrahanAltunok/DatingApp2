import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, query, where, onSnapshot, orderBy, addDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCfE2QYJKPNvaaXDIxUlGQSLHSJez-V-No",
  authDomain: "dateapp-d0658.firebaseapp.com",
  projectId: "dateapp-d0658",
  storageBucket: "dateapp-d0658.appspot.com",
  messagingSenderId: "369307984656",
  appId: "1:369307984656:web:b76dae469dcb239b7bfb95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [usernames, setUsernames] = useState({});
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchConversations = async () => {
      if (currentUserId) {
        const likedByUser = query(
          collection(db, 'interactions'),
          where('likerId', '==', currentUserId),
          where('status', '==', 'like')
        );
        const likedByUserSnapshot = await getDocs(likedByUser);
        const likedByUserIds = likedByUserSnapshot.docs.map(doc => doc.data().targetId);

        const likedByOthers = query(
          collection(db, 'interactions'),
          where('targetId', '==', currentUserId),
          where('status', '==', 'like')
        );
        const likedByOthersSnapshot = await getDocs(likedByOthers);
        const likedByOthersIds = likedByOthersSnapshot.docs.map(doc => doc.data().likerId);

        const mutualLikes = likedByUserIds.filter(id => likedByOthersIds.includes(id));

        for (const userId of mutualLikes) {
          const existingConversation = await getDocs(
            query(
              collection(db, 'conversations'),
              where('members', 'array-contains', currentUserId)
            )
          );

          const existingConversationWithUser = existingConversation.docs.find(doc =>
            doc.data().members.includes(userId)
          );

          if (!existingConversationWithUser) {
            const newConversationRef = doc(collection(db, 'conversations'));
            await setDoc(newConversationRef, {
              members: [currentUserId, userId],
              lastMessage: 'Hi',
              lastMessageTime: new Date(),
            });

            await addDoc(collection(db, `conversations/${newConversationRef.id}/messages`), {
              text: 'Hi',
              createdAt: new Date(),
              senderId: 'system',
            });
          }
        }

        const unsubscribe = onSnapshot(
          query(
            collection(db, 'conversations'),
            where('members', 'array-contains', currentUserId),
            orderBy('lastMessageTime', 'desc')
          ),
          async (querySnapshot) => {
            const updatedConversations = [];
            const usernamesToFetch = [];
            querySnapshot.forEach((doc) => {
              updatedConversations.push({ id: doc.id, ...doc.data() });
              const otherUserId = doc.data().members.find(member => member !== currentUserId);
              if (!usernames[otherUserId]) {
                usernamesToFetch.push(otherUserId);
              }
            });

            if (usernamesToFetch.length > 0) {
              const newFetchedUsernames = {};
              for (const userId of usernamesToFetch) {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                  newFetchedUsernames[userId] = userDoc.data().username;
                }
              }
              setUsernames(prevUsernames => ({ ...prevUsernames, ...newFetchedUsernames }));
            }

            setConversations(updatedConversations);
          }
        );

        return unsubscribe;
      }
    };

    fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      const q = query(
        collection(db, `conversations/${selectedConversation}/messages`),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(messages);
      });

      return unsubscribe;
    }
  }, [selectedConversation]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      await addDoc(collection(db, `conversations/${selectedConversation}/messages`), {
        text: newMessage,
        createdAt: new Date(),
        senderId: currentUserId,
      });
      await setDoc(doc(db, 'conversations', selectedConversation), {
        lastMessage: newMessage,
        lastMessageTime: new Date(),
      }, { merge: true });
      setNewMessage('');
    }
  };

  const renderChatItem = ({ item }) => {
    const otherUserId = item.members.find(member => member !== currentUserId);
    const otherUsername = usernames[otherUserId] || 'Unknown User';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => setSelectedConversation(item.id)}
      >
        <Text style={styles.username}>{otherUsername}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.message}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {selectedConversation ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)} style={styles.backButton}>
              <Text style={styles.backButtonText}>Geri</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{usernames[selectedConversation]}</Text>
          </View>
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.input}
              placeholder="Mesajınızı yazın"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#D30455',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#D30455',
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatList: {
    padding: 10,
    paddingTop: 20,
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#D30455',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

