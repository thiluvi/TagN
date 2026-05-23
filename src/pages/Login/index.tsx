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
import { useShop } from "../../context/ShopContext";

export function Login({ navigation }: any) {
  const { refreshUserData } = useShop();

  // guardando email e senha q o cara digita
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = async () => {
    // bloqueia se tentar logar com campo vazio
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      // tenta mandar pro backend no meu ip local pq no emulador as vezes buga
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(
        `${URL_BACKEND}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        },
      );

      // se deu bom (status 200), pega os dados da resposta
      if (response.ok) {
        const userData = await response.json();

        // salva no asyncstorage pro app lembrar q ele ta logado
        await AsyncStorage.setItem("@tagn_user", JSON.stringify(userData));

        // Atualiza os dados de sacola e favoritos no contexto
        await refreshUserData();

        Alert.alert("Bem-vindo!", `Olá, ${userData.nome}`);
        navigation.replace("Home");
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ImageBackground
        source={require("../../assets/Utilitarios/banner.png")}
        style={styles.backgroundImage}
      >
        {/* Fixed back button */}
        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>Bem vindo(a) de volta</Text>

            {/* digita o email aqui */}
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

            {/* digita a senha aqui */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="digite sua senha"
                  placeholderTextColor="#A0A0A0"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowSenha(!showSenha)}
                  style={styles.eyeButton}
                >
                  <Feather
                    name={showSenha ? "eye-off" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* manda bala no login */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* linkzinho pra quem n tem conta ir pro cadastro q eu fiz antes */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                <Text style={styles.footerLink}>Crie uma</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: "flex-end",
  },
  topSection: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 20,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  eyeButton: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#5C4033",
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
    color: "#0056D2",
    textDecorationLine: "underline",
  },
});
