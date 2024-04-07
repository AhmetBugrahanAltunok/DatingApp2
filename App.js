import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage'; // Ana sayfa bileşeninizi burada içe aktarın
import LoginPage from './LoginPage'; // Giriş sayfası bileşeninizi burada içe aktarın

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Giriş Yap' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
