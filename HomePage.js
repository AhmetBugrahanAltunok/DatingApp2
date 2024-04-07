import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomePage({ navigation }) {
  const handleLoginPress = () => {
    // Giriş yap sayfasına yönlendirme işlemi
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    // Kaydol sayfasına yönlendirme işlemi
    // Burada kayıt işlemleri için gerekli navigasyon kodları eklenebilir
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Love Magnet</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Giriş Yap"
          onPress={handleLoginPress}
        />
        <Button
          title="Kaydol"
          onPress={handleSignupPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
});
