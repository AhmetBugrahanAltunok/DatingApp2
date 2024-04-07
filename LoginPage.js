import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Giriş yapma işlemini burada gerçekleştirin
  };

  const handleSignup = () => {
    // Kaydolma işlemini burada gerçekleştirin
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Giriş Yap"
          onPress={handleLogin}
          style={styles.button}
        />
        <Button
          title="Kaydol"
          onPress={handleSignup}
          style={styles.button}
        />
      </View>
      <Button
        title="Şifremi Unuttum"
        onPress={() => console.log('Şifremi unuttum')}
        style={styles.forgotPasswordButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1, // Butonları eşit boyutlara sahip olacak şekilde esnek boyutlandırma
    marginHorizontal: 5,
  },
  forgotPasswordButton: {
    marginVertical: 10,
  },
});
