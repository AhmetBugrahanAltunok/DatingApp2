import React, { useState, useEffect } from 'react'; // Tek bir import
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { getFirestore, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const db = getFirestore();

// Örnek sohbet verileri
const conversations = [
  { id: 1, userId: 1, username: 'User1', lastMessage: 'Merhaba' },
  { id: 2, userId: 2, username: 'User2', lastMessage: 'Hi' },
  // Diğer sohbetler buraya eklenebilir
];

export default function ChatPage({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const currentUserId = 'your_current_user_id'; // Firebase'den oturum açan kullanıcının ID'si

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'conversations'),
        where('members', 'array-contains', currentUserId),
        orderBy('lastMessageTime', 'desc')
      ),
      (querySnapshot) => {
        const updatedConversations = [];
        querySnapshot.forEach((doc) => {
          updatedConversations.push({ id: doc.id, ...doc.data() });
        });
        setConversations(updatedConversations);
      }
    );
    return unsubscribe;
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatSelect(item.userId)}
    >
      <Image source={require('./assets/users/user1.jpg')} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderChatItem}
    />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, // Ekranın üstündeki boşluğu artırır
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  chatInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 16,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D30455',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
