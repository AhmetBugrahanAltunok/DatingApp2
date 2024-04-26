import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage'; 
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';  

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="Signup" component={SignupPage} options={{ title: 'Signup Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
