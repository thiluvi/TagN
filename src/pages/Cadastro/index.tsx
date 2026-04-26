import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { Feather } from '@expo/vector-icons';

export function Cadastro({ navigation }) {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground 
        source={require('../../assets/Utilitarios/plano de fundo.png')} 
        style={styles.backgroundImage}
      >
        
        {/* Área superior (botão de voltar) */}
        <View style={styles.topSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Área inferior branca (Bottom Sheet) */}
        <View style={styles.bottomSheet}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>Cadastre-se</Text>

            {/* Input de Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput 
                style={styles.input}
                placeholder="digite seu nome"
                placeholderTextColor="#A0A0A0"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* Input de Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput 
                style={styles.input}
                placeholder="digite seu e-mail"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input de Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput 
                style={styles.input}
                placeholder="digite sua senha"
                placeholderTextColor="#A0A0A0"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            {/* Input de Confirmar Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirme a senha</Text>
              <TextInput 
                style={styles.input}
                placeholder="digite novamente sua senha"
                placeholderTextColor="#A0A0A0"
                value={confirmaSenha}
                onChangeText={setConfirmaSenha}
                secureTextEntry
              />
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Cadastre-se</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    paddingTop: 50, // Espaço para a barra de status
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    flex: 3, // Ocupa um pouco mais de espaço que o login
  },
  scrollContent: {
    paddingBottom: 40, // Espaço extra no final da rolagem
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center', // Centralizado como na imagem
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  registerButton: {
    backgroundColor: '#5C4033', // Cor marrom baseada na imagem/login
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});