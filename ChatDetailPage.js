import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';

// Örnek sohbet 
const initialMessages = [
  { id: 1, senderId: 1, text: 'Merhaba' },
  { id: 2, senderId: 2, text: 'Merhaba, nasılsın?' },
];

export default function ChatDetailPage({ route }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const scrollViewRef = useRef();

  useEffect(() => {
    // Yeni mesajlar eklendiğinde, ScrollView'i en altta tutmak için scroll yap
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (message.trim() !== '') {
      // Yeni mesajı ekleyin
      const newMessage = { id: messages.length + 1, senderId: 1, text: message }; // Burada gönderenin id'sini belirtiyor
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messageContainer}
      >
        {messages.map((item) => (
          <View key={item.id} style={[styles.message, item.senderId === 1 ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, item.senderId === 1 && { color: '#fff' }]}>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>
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
