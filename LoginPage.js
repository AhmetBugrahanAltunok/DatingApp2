import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground, Alert, Modal } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth';
import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCfE2QYJKPNvaaXDIxUlGQSLHSJez-V-No",
  authDomain: "dateapp-d0658.firebaseapp.com",
  projectId: "dateapp-d0658",
  storageBucket: "dateapp-d0658.appspot.com",
  messagingSenderId: "369307984656",
  appId: "1:369307984656:web:b76dae469dcb239b7bfb95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Giriş başarılı:', user.uid);
      Alert.alert('Başarılı', 'Giriş işlemi başarıyla tamamlandı.');
      navigation.navigate('Main');
    } catch (error) {
      let errorMessage = 'Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Yanlış şifre girdiniz.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz bir e-posta adresi girdiniz.';
      }
      Alert.alert('Giriş Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsModalVisible(true);
  };

  const handleSendResetEmail = async () => {
    try {
      if (resetEmail) {
        await sendPasswordResetEmail(auth, resetEmail);
        Alert.alert('Başarılı', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setResetEmail('');
        setIsModalVisible(false); 
      } else {
        Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin veya geçerli bir e-posta adresi girdiğinizden emin olun.');
    }
  };

  return (
    <ImageBackground source={require('./assets/bckgraund/loginBG.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, styles.usernameInput]}
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        {/* Şifre Sıfırlama Modalı */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Şifremi Sıfırla</Text>
              <TextInput
                placeholder="E-posta adresinizi girin"
                value={resetEmail}
                onChangeText={setResetEmail}
                style={styles.input}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendResetEmail}>
                <Text style={styles.sendButtonText}>Gönder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
