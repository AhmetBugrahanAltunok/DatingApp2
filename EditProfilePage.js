import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EditProfilePage = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [bio, setBio] = useState(userProfile.bio);
  const [hobbies, setHobbies] = useState(userProfile.hobbies || []);
  const [image, setImage] = useState(userProfile.imageUrl);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

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

    setLoading(true);
    let imageUrl = image;
    try {
      if (image && image !== userProfile.imageUrl) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        bio,
        hobbies,
        imageUrl
      });

      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      navigation.navigate('Profile'); // Güncelleme sonrası profil sayfasına yönlendir
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
      console.error('Profil güncelleme hatası:', error.message);
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
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Profil Resmi Seç</Text>
        )}
      </TouchableOpacity>
      <Button title="Güncelle" onPress={handleSubmit} disabled={loading} />
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

export default EditProfilePage;
