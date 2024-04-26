import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage'; 
import LoginPage from './LoginPage';
import SignupPage from './SignupPage'; 
import  MainPage from './MainPage';
import  ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';

    

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="Signup" component={SignupPage} options={{ title: 'Signup Page' }} />
        <Stack.Screen name="Main" component={MainPage} options={{ title: 'Main Page' }} />
        <Stack.Screen name="Chat" component={ChatPage} options={{ title: 'Chat Page' }} />
        
        <Stack.Screen name="Profile" component={ProfilePage} options={{ title: 'Profile Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
