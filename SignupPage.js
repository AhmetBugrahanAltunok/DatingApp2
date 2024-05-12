import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../firebaseDB/firebaseConfig'; // Firebase yapılandırma dosyasını içe aktarın
import 'firebase/auth'; 
import 'firebase/firestore'; 

export default function SignupPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignup = () => {
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Kaydınız başarıyla oluşturuldu!');

        // Firestore'da kullanıcı verilerini kaydetme
        firebase.firestore().collection('users').doc(user.uid).set({
          username,
          email,
          age,
          gender
        });

        navigation.navigate('Home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage); // Hata mesajını ayarlayın
        console.error('Signup Error:', errorMessage); // Konsola hata mesajını yazdırın
      });
  };

  return (
    <ImageBackground source={require('./assets/bckgraund/SignupBG.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text> // Hata mesajını görüntüleyin
        )}
        <TextInput
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) =>
            setGender(itemValue)
          }>
          <Picker.Item label="Cinsiyet Seçiniz" value="" />
          <Picker.Item label="Erkek" value="Erkek" />
          <Picker.Item label="Kadın" value="Kadın" />
          <Picker.Item label="Diğer" value="Diğer" />
        </Picker>
        <TextInput
          placeholder="Yaş"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Kaydol</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    backgroundColor: '#D30455',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
