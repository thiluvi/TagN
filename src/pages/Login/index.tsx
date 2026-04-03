import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Login</Text>
      
      {/* Botão para ir para a tela de Cadastro */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { padding: 10, backgroundColor: '#007BFF', borderRadius: 5 },
  buttonText: { color: '#FFF' }
});