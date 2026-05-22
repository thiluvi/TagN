import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { CustomTabBar } from "../components/CustomTabBar";
import { Home } from "../pages/Home";
import { Perfil } from "../pages/Perfil";
import { Sacola } from "../pages/Sacola";
import { Favoritos } from "../pages/Favoritos";
import { Pesquisa } from "../pages/Pesquisa";

// Inicializa o Navegador de Abas Inferior
const Tab = createBottomTabNavigator();

/**
 * TabRoutes - Componente de navegação inferior por abas do aplicativo.
 * Utiliza o CustomTabBar para renderizar botões elegantes com desfoque de fundo.
 */
export function TabRoutes() {
  return (
    <Tab.Navigator
      // Injeta o componente CustomTabBar passando as propriedades de estado e navegação
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Definições das telas integradas na barra de navegação principal */}
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="BagTab" component={Sacola} />
      <Tab.Screen name="HeartTab" component={Favoritos} />
      <Tab.Screen name="SearchTab" component={Pesquisa} />
      <Tab.Screen name="PerfilTab" component={Perfil} />
    </Tab.Navigator>
  );
}
