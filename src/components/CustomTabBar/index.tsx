import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';

/**
 * CustomTabBar - Componente de barra de navegação customizado com efeito de glassmorphism.
 * Este componente substitui a tab bar nativa do React Navigation por um design suspenso e elegante.
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bottomNavWrapper}>
      {/* 
        BlurView - Efeito de vidro desfocado para dar profundidade visual.
        No iOS o desfoque nativo é mais forte, por isso ajustamos a intensidade baseada na plataforma.
      */}
      <BlurView 
        intensity={Platform.OS === 'ios' ? 30 : 80} 
        tint="light" 
        style={styles.bottomNav}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          /**
           * onPress - Gerencia a navegação ao clicar no ícone correspondente.
           * Emite o evento 'tabPress' para respeitar possíveis prevenções de navegação.
           */
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Define o ícone adequado utilizando o pacote Feather Icons de acordo com o nome da rota da aba
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'BagTab') iconName = 'shopping-bag';
          else if (route.name === 'HeartTab') iconName = 'heart';
          else if (route.name === 'SearchTab') iconName = 'search';
          else if (route.name === 'PerfilTab') iconName = 'user';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.navItem}
            >
              <View style={styles.iconContainer}>
                {/* Ícone estilizado. Usa a cor de destaque (marrom da marca) se ativo, ou cinza neutro se inativo */}
                <Feather 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? "#5C4033" : "#A59D99"} 
                />
                {/* Exibe uma bolinha indicadora abaixo do ícone caso a aba esteja selecionada */}
                {isFocused && <View style={styles.activeDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Envoltório para posicionar a tab bar de forma suspensa/flutuante no rodapé da tela
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  // Barra de abas com cantos arredondados, sombra suave e cor de fundo com opacidade para efeito vidro
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(92, 64, 51, 0.08)',
  },
  // Item clicável individual correspondente a cada rota
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    padding: 8,
  },
  // Alinhamento centralizado do ícone
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Bolinha de indicação da aba ativa
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5C4033',
    position: 'absolute',
    bottom: -8,
  },
});
