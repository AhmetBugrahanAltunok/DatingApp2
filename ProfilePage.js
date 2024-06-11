import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "AIzaSyCfE2QYJKPNvaaXDIxUlGQSLHSJez-V-No",
  authDomain: "dateapp-d0658.firebaseapp.com",
  projectId: "dateapp-d0658",
  storageBucket: "dateapp-d0658.appspot.com",
  messagingSenderId: "369307984656",
  appId: "1:369307984656:web:b76dae469dcb239b7bfb95"
};

let app;
let auth;
let firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  firestore = getFirestore(app);
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
}

const getZodiacSign = (dateOfBirth) => {
  const [day, month] = dateOfBirth.split('/').map(Number);
  
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
    return 'Kova';
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return 'Balık';
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
    return 'Koç';
  } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
    return 'Boğa';
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return 'İkizler';
  } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
    return 'Yengeç';
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return 'Aslan';
  } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return 'Başak';
  } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
    return 'Terazi';
  } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
    return 'Akrep';
  } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
    return 'Yay';
  } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
    return 'Oğlak';
  }
  return '';
};

export default function ProfilePage({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  const fetchUserProfile = async () => {
    try {
      const docRef = doc(firestore, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [currentUser])
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D30455" />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profil yüklenemedi.</Text>
      </View>
    );
  }

  const zodiacSign = getZodiacSign(userProfile.dateOfBirth);

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <View style={[
            styles.imageContainer,
            userProfile.gender === 'Erkek' ? styles.maleBorder :
            userProfile.gender === 'Kadın' ? styles.femaleBorder :
            styles.otherBorder
          ]}>
            <Image source={{ uri: userProfile.imageUrl }} style={styles.image} />
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>{userProfile.username}</Text>
        <Text style={styles.bio}>{userProfile.bio}</Text>
        <Text style={styles.zodiacSign}>{zodiacSign} Burcu</Text>
        <View style={styles.hobbiesContainer}>
          {userProfile.hobbies.map((hobby, index) => (
            <Text key={index} style={styles.hobby}>{hobby}</Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfilePage', { userProfile })}
        >
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Main')}>
          <Text style={styles.buttonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chat')}>
          <Text style={styles.buttonText}>Sohbet</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalImageContainer}>
            <Image source={{ uri: userProfile.imageUrl }} style={styles.modalImage} resizeMode="cover" />
          </View>
        </View>
      </Modal>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
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
  zodiacSign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  hobby: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#D30455',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#D30455',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalImageContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 125, 
  },
  maleBorder: {
    borderWidth: 3,
    borderColor: '#0000FF',
  },
  femaleBorder: {
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  otherBorder: {
    borderWidth: 3,
    borderColor: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
  },
});
