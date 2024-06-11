import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage'; 
import LoginPage from './LoginPage';
import SignupPage from './SignupPage'; 
import MainPage from './MainPage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import ChatDetailPage from './ChatDetailPage';
import CreateProfilePage from './CreateProfilePage';
import EditProfilePage from './EditProfilePage';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomePage" component={HomePage} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="Signup" component={SignupPage} options={{ title: 'Kayıt Ol' }} />
        <Stack.Screen name="Main" component={MainPage} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="CreateProfilePage" component={CreateProfilePage} options={{ title: 'Profil Oluştur' }} />
        <Stack.Screen name="EditProfilePage" component={ EditProfilePage } options={{ title: 'Profil Editle' }} />
        <Stack.Screen name="Chat" component={ChatPage} options={{ title: 'Sohbet' }} />
        <Stack.Screen name="Profile" component={ProfilePage} options={{ title: 'Profil' }} />
        <Stack.Screen name="ChatDetail" component={ChatDetailPage} options={{ title: 'Sohbet Detayı' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
