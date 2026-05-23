import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../../context/ShopContext";

export function Conta({ navigation }: any) {
  const { refreshUserData } = useShop();

  const [id, setId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@tagn_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setId(user.id);
          setNome(user.nome || "");
          setEmail(user.email || "");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!nome.trim()) {
      showAlert("Atenção", "O nome não pode ficar em branco.");
      return;
    }

    // Se preencher a nova senha, precisa preencher o resto
    if (novaSenha || confirmarNovaSenha) {
      if (!senhaAtual) {
        showAlert("Atenção", "Por favor, digite a sua senha atual para alterar a senha.");
        return;
      }
      if (novaSenha.length < 6) {
        showAlert("Atenção", "A nova senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (novaSenha !== confirmarNovaSenha) {
        showAlert("Atenção", "A nova senha e a confirmação de senha não coincidem.");
        return;
      }
    }

    try {
      setIsLoading(true);
      const URL_BACKEND = "http://localhost:8080";

      const updateData = {
        nome: nome.trim(),
        senhaAtual: senhaAtual ? senhaAtual : null,
        novaSenha: novaSenha ? novaSenha : null,
      };

      const response = await fetch(`${URL_BACKEND}/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Atualizar dados no AsyncStorage
        const storedUser = await AsyncStorage.getItem("@tagn_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.nome = updatedUser.nome;
          await AsyncStorage.setItem("@tagn_user", JSON.stringify(user));
        }

        // Forçar atualização do context
        await refreshUserData();

        showAlert("Sucesso", "Informações atualizadas com sucesso!");
        navigation.goBack();
      } else {
        const errorMsg = await response.text();
        showAlert("Erro", errorMsg || "Não foi possível atualizar as informações.");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      showAlert("Erro", "Erro ao conectar-se com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Informações da Conta</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar / Perfil visual */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Feather name="user" size={44} color="#5C4033" />
            </View>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Formulário - Dados Gerais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Gerais</Text>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome do usuário"
                  placeholderTextColor="#A0A0A0"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>
            </View>

            {/* E-mail (somente leitura) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail (Não alterável)</Text>
              <View style={[styles.inputWrapper, styles.disabledWrapper]}>
                <Feather name="mail" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            </View>
          </View>

          {/* Formulário - Segurança (Senha) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança (Alterar Senha)</Text>
            <Text style={styles.sectionSubtitle}>
              Preencha os campos abaixo apenas se desejar redefinir sua senha.
            </Text>

            {/* Senha Atual */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha Atual</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha atual"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showSenhaAtual}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                />
                <TouchableOpacity
                  onPress={() => setShowSenhaAtual(!showSenhaAtual)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showSenhaAtual ? "eye-off" : "eye"}
                    size={18}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nova Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Senha</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="No mínimo 6 caracteres"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showNovaSenha}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
                <TouchableOpacity
                  onPress={() => setShowNovaSenha(!showNovaSenha)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showNovaSenha ? "eye-off" : "eye"}
                    size={18}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Nova Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a nova senha"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showConfirmarNovaSenha}
                  value={confirmarNovaSenha}
                  onChangeText={setConfirmarNovaSenha}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmarNovaSenha(!showConfirmarNovaSenha)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showConfirmarNovaSenha ? "eye-off" : "eye"}
                    size={18}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Botão de Salvar */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>SALVAR ALTERAÇÕES</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FDF9F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE0DA",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 14,
    color: "#777777",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C4033",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#888888",
    marginBottom: 15,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    paddingHorizontal: 15,
  },
  disabledWrapper: {
    backgroundColor: "#F2F2F2",
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333333",
  },
  disabledInput: {
    color: "#777777",
  },
  eyeBtn: {
    padding: 8,
  },
  saveBtn: {
    backgroundColor: "#5C4033",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
