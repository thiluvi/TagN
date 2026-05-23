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

export function Cadastro({ navigation }: any) {
  // estados pra guardar o que o usuario digita nos inputs
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);

  // funcao que roda quando clica no botao de cadastrar
  const handleCadastro = async () => {
    // verifica se tem algum campo vazio
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    // validacao basica de email que peguei na net pra ver se tem @
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Erro",
        "Por favor, insira um e-mail válido (exemplo@email.com).",
      );
      return;
    }

    // verifica se a senha tem pelo menos 6 caracteres senao o backend barra
    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // ve se o cara digitou a senha igual nas duas vezes
    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    try {
      // url da api (coloquei meu ip fixo pq o localhost tava bugando no emulador)
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(
        `${URL_BACKEND}/api/auth/cadastro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        },
      );

      // se voltar status 201 quer dizer q criou no banco de dados e redireciona para o login
      if (response.status === 201) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        navigation.navigate("Login");
      } else {
        const erro = await response.text();
        Alert.alert("Erro", erro || "Falha no cadastro.");
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
            <Text style={styles.title}>Cadastre-se</Text>

            {/* campo do nome */}
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

            {/* campo do email */}
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

            {/* campo da senha q esconde as letrinhas */}
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

            {/* campo de confirmar senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirme a senha</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="digite novamente sua senha"
                  placeholderTextColor="#A0A0A0"
                  value={confirmaSenha}
                  onChangeText={setConfirmaSenha}
                  secureTextEntry={!showConfirmaSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmaSenha(!showConfirmaSenha)}
                  style={styles.eyeButton}
                >
                  <Feather
                    name={showConfirmaSenha ? "eye-off" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* botao q manda pro banco */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleCadastro}
            >
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
    marginBottom: 30,
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
  registerButton: {
    backgroundColor: "#5C4033",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
