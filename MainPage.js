import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';

const profiles = [
  { id: 1, username: 'User1', age: 25, bio: 'Lorem ipsum dolor sit amet.', image: require('./assets/users/user1.jpg') },
  { id: 2, username: 'User2', age: 28, bio: 'Consectetur adipiscing elit.', image: require('./assets/users/user2.jpg') },
];

export default function MainPage({ navigation }) {
  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Swiper style={styles.wrapper} loop={false}>
        {profiles.map(profile => (
          <View key={profile.id} style={styles.slide}>
            <Image source={profile.image} style={styles.image} />
            <Text style={styles.username}>{profile.username}, {profile.age}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        ))}
      </Swiper>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Main')}>
          <Text style={styles.buttonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chat')}>
          <Text style={styles.buttonText}>Sohbet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Profile')}>
          <Text style={styles.buttonText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginBottom: 50,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
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
