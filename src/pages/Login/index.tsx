import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Login({ navigation }) {
  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const IP_DO_COMPUTADOR = "192.168.15.4";
      const response = await fetch(
        `http://${IP_DO_COMPUTADOR}:8080/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        },
      );

      if (response.ok) {
        const userData = await response.json();

        // SALVANDO O USUÁRIO: Transformamos o objeto em string para guardar
        await AsyncStorage.setItem("@tagn_user", JSON.stringify(userData));

        Alert.alert("Bem-vindo!", `Olá, ${userData.nome}`);
        navigation.replace("Home"); // 'replace' impede que o usuário volte para a tela de login
      } else {
        Alert.alert("Erro", "E-mail ou senha inválidos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Atenção: Substitua 'nome-da-sua-imagem.png' pelo nome real do arquivo 
        que está na sua pasta assets.
      */}
      <ImageBackground
        source={require("../../assets/Utilitarios/plano de fundo.png")}
        style={styles.backgroundImage}
      >
        {/* Área superior transparente (onde fica o botão de voltar) */}
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
            <Text style={styles.title}>Bem vindo(a) de volta</Text>

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
                secureTextEntry // Esconde a senha com asteriscos
              />
            </View>

            {/* Botão de Entrar */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Rodapé com link para Cadastro */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                <Text style={styles.footerLink}>Crie uma</Text>
              </TouchableOpacity>
            </View>
            {/* Adicione este espaço extra antes do fechamento do ScrollView */}
            <View style={{ height: 50 }} />
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
    resizeMode: "cover",
    justifyContent: "space-between", // Separa o topo da folha branca
  },
  topSection: {
    flex: 1,
    paddingTop: 50, // Espaço para a barra de status do celular
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backArrow: {
    color: "#FFF", // Ajuste a cor da seta dependendo da imagem de fundo
    fontSize: 28,
    fontWeight: "bold",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
    // O flex abaixo controla a altura da parte branca. Aumente se quiser que ela suba mais.
    flex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: "#333",
    padding: 0, // Remove o padding padrão do Android
  },
  loginButton: {
    backgroundColor: "#5C4033", // Tom de marrom escuro baseado na imagem
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#000",
  },
  footerLink: {
    fontSize: 14,
    color: "#0056D2", // Cor azul para o link
    textDecorationLine: "underline",
  },
});
