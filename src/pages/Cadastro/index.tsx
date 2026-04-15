import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Cadastro({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Cadastro</Text>
      
      {/* Botão para voltar para a tela de Login */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { padding: 10, backgroundColor: '#28A745', borderRadius: 5 },
  buttonText: { color: '#FFF' }
});