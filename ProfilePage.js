import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function ProfilePage({ navigation }) {
 
  const user = {
    username: 'User1',
    age: 25,
    bio: 'Lorem ipsum dolor sit amet.',
    hobbies: ['Spor', 'Müzik', 'Yemek Yapmak'],
    image: require('./assets/users/user1.jpg'),
  };

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={user.image} style={styles.image} />
        <Text style={styles.username}>{user.username}, {user.age}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.hobbiesContainer}>
          {user.hobbies.map((hobby, index) => (
            <Text key={index} style={styles.hobby}>{hobby}</Text>
          ))}
        </View>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Main')}>
          <Text style={styles.buttonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chat')}>
          <Text style={styles.buttonText}>Sohbet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  hobbiesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  hobby: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 10,
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
