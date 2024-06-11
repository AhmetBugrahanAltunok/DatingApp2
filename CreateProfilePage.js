import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

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
let storage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  firestore = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

const CreateProfilePage = ({ route, navigation }) => {
  const { email, name, surname, dateOfBirth, username } = route.params;
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const hobbyOptions = [
    "Kitap okuma",
    "Yürüyüş yapma",
    "Yemek pişirme",
    "Fotoğraf çekme",
    "Bisiklete binme",
    "Bahçe işleri",
    "Resim yapma",
    "Müzik dinleme",
    "El işi",
    "Balık tutma"
  ];

  const genderOptions = ["Erkek", "Kadın", "Diğer"];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleHobbyChange = (hobby) => {
    setHobbies((prevHobbies) => {
      if (prevHobbies.includes(hobby)) {
        return prevHobbies.filter((h) => h !== hobby);
      } else {
        return [...prevHobbies, hobby].slice(0, 4); // En fazla 4 hobi seçilebilir
      }
    });
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert('Hata', 'Kullanıcı giriş yapmamış.');
      return;
    }

    if (!gender) {
      Alert.alert('Hata', 'Lütfen cinsiyet seçiniz.');
      return;
    }

    setLoading(true);
    let imageUrl = '';
    try {
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
        console.log('Uploading to:', storageRef.fullPath);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(firestore, "users", auth.currentUser.uid), {
        email,
        name,
        surname,
        dateOfBirth,
        username,
        bio,
        hobbies,
        imageUrl,
        gender
      });

      Alert.alert('Başarılı', 'Profiliniz oluşturuldu.');
      navigation.navigate('Main'); // Profil oluşturulduktan sonra yönlendirilecek sayfa
    } catch (error) {
      Alert.alert('Hata', 'Profil oluşturulurken bir hata oluştu.');
      console.error('Profil oluşturma hatası:', error.message);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Biyografi"
        value={bio}
        onChangeText={setBio}
        style={styles.input}
      />
      <Text style={styles.label}>Hobiler (En fazla 4 tane seçilebilir):</Text>
      {hobbyOptions.map((hobby, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.hobbyButton,
            hobbies.includes(hobby) && styles.hobbyButtonSelected,
          ]}
          onPress={() => handleHobbyChange(hobby)}
        >
          <Text
            style={[
              styles.hobbyButtonText,
              hobbies.includes(hobby) && styles.hobbyButtonTextSelected,
            ]}
          >
            {hobby}
          </Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>Cinsiyet:</Text>
      {genderOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.genderButton,
            gender === option && styles.genderButtonSelected,
          ]}
          onPress={() => setGender(option)}
        >
          <Text
            style={[
              styles.genderButtonText,
              gender === option && styles.genderButtonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Profil Resmi Seç</Text>
        )}
      </TouchableOpacity>
      <Button title="Gönder" onPress={handleSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  hobbyButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
  },
  hobbyButtonSelected: {
    backgroundColor: '#d30455',
  },
  hobbyButtonText: {
    color: '#000',
  },
  hobbyButtonTextSelected: {
    color: '#fff',
  },
  genderButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#d30455',
  },
  genderButtonText: {
    color: '#000',
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 200,
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
});

export default CreateProfilePage;
