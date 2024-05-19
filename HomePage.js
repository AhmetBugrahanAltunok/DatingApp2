import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function HomePage({ navigation }) {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup'); 
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/bckgraund/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={handleLoginPress}
            >
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={handleSignupPress}
            >
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '80%',
    backgroundColor: 'rgba(211, 4, 85, 0.0)', // Şeffaf kırmızı (opaklık: 0.7)
  },
  loginButton: {
    marginBottom: 20, // "Giriş Yap" butonunu biraz yukarı al
  },
  signupButton: {
    marginBottom: 3, // "Kayıt Ol" butonunu biraz daha aşağı indir
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
