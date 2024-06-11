import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const passwordInputRef = useRef(null);

  const handleEmailPasswordSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Girilen şifreler eşleşmiyor.");
      }

      await createUserWithEmailAndPassword(auth, email, password);
      setShowAdditionalFields(true);
    } catch (error) {
      Alert.alert("Kayıt Hatası", error.message);
    }
  };

  if (showAdditionalFields) {
    return (
      <AdditionalInfoScreen
        navigation={navigation}
        email={email}
        onAdditionalInfoSubmit={(additionalInfo) => {
          navigation.navigate("CreateProfilePage", {
            email,
            ...additionalInfo,
          });
        }}
      />
    );
  }

  return (
    <ImageBackground
      source={require('./assets/bckgraund/SignupBG.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={showAdditionalFields ? 5 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Şifre"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifreyi Onayla"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleEmailPasswordSubmit}>
          <Text style={styles.registerButtonText}>İleri</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const AdditionalInfoScreen = ({ navigation, email, onAdditionalInfoSubmit }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    onAdditionalInfoSubmit({ name, surname, dateOfBirth, username });
  };

  return (
    <ImageBackground
      source={require('./assets/bckgraund/SignupBG.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={5}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="İsim"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Soyisim"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={styles.input}
            placeholder="Doğum Tarihi (GG/AA/YYYY)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 195,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  registerButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});

export default SignupPage;
