import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Cadastro } from "../pages/Cadastro";
import { Login } from "../pages/Login";
import { TabRoutes } from "./tab.routes";

const Stack = createNativeStackNavigator();

export function Routes() {
  // 1. Estados para controlar a tela inicial e o carregamento
  const [initialRoute, setInitialRoute] = useState("Login"); // Padrão é Login
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  // 2. Efeito que roda assim que o aplicativo abre
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Tenta achar o 'crachá' do usuário salvo no celular
        const userData = await AsyncStorage.getItem("@tagn_user");

        if (userData) {
          // Se achou, muda a rota inicial direto para a Home
          setInitialRoute("Home");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        // Independente de achar ou não, avisa que o carregamento terminou
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // 3. Tela de espera (Enquanto busca no AsyncStorage)
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#5C4033" />
      </View>
    );
  }

  // 4. Renderiza as rotas com a initialRoute dinâmica
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Home"
          component={TabRoutes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
