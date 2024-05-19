import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('Main');
  };

  const handleForgotPassword = () => {
    alert('Şifrenizi sıfırlamak için e-posta adresinize bir bağlantı gönderildi.');
  };

  return (
    <ImageBackground source={require('./assets/bckgraund/loginBG.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          style={[styles.input, styles.usernameInput]}
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
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
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  passwordInput: {
    marginTop: 10,
  },
  button: {
    width: '80%',
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  forgotPasswordContainer: {
    marginTop: 20,
  },
  forgotPassword: {
    color: '#D30455',
  },
  usernameInput: {
    marginTop: 180,
  },
});
