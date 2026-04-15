import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from '../pages/Login';
import { Cadastro } from '../pages/Cadastro';
import { Home } from '../pages/Home';

const Stack = createNativeStackNavigator();

export function Routes() {
  return (
    <NavigationContainer>
      {/* initialRoute como "home" para definir a nossa tela inicial */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}