import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ESTADOS_BRASIL = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

export function NovoEndereco({ route, navigation }: any) {
  const addressToEdit = route.params?.address;

  // Form fields
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);

  // Load existing address data if editing
  useEffect(() => {
    if (addressToEdit) {
      setCep(addressToEdit.cep || "");
      setRua(addressToEdit.rua || "");
      setNumero(addressToEdit.numero || "");
      setComplemento(addressToEdit.complemento || "");
      setBairro(addressToEdit.bairro || "");
      setCidade(addressToEdit.cidade || "");
      setEstado(addressToEdit.estado || "");
    }
  }, [addressToEdit]);

  // Autofill address details from ViaCEP API
  const handleCepChange = async (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setCep(cleaned);

    if (cleaned.length === 8) {
      try {
        setIsFetchingCep(true);
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        if (response.ok) {
          const data = await response.json();
          if (data.erro) {
            Alert.alert("Erro", "CEP não encontrado. Por favor, verifique.");
          } else {
            setRua(data.logradouro || "");
            setBairro(data.bairro || "");
            setCidade(data.localidade || "");
            
            // Check if returned state (uf) exists in our list
            const foundState = ESTADOS_BRASIL.find(
              (item) => item.uf.toUpperCase() === data.uf?.toUpperCase()
            );
            if (foundState) {
              setEstado(foundState.uf);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const handleSave = async () => {
    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos obrigatórios (marcados com *).");
      return;
    }

    try {
      setIsSaving(true);
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (!storedUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        navigation.navigate("Login");
        return;
      }
      const user = JSON.parse(storedUser);
      const URL_BACKEND = "http://localhost:8080";

      const addressData = {
        id: addressToEdit ? addressToEdit.id : null,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        usuario: { id: user.id },
      };

      const response = await fetch(`${URL_BACKEND}/enderecos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        Alert.alert("Sucesso", addressToEdit ? "Endereço atualizado!" : "Endereço salvo!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", "Não foi possível salvar o endereço no momento.");
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {addressToEdit ? "Editar Endereço" : "Novo Endereço"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formInstructions}>
          Insira seu CEP para preencher o endereço automaticamente.
        </Text>

        {/* CEP */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>CEP *</Text>
            {isFetchingCep && <ActivityIndicator size="small" color="#5C4033" style={{ marginLeft: 8 }} />}
          </View>
          <TextInput
            style={styles.input}
            placeholder="00000000"
            placeholderTextColor="#A0A0A0"
            value={cep}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>

        {/* Rua */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Rua / Logradouro *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da rua ou avenida"
            placeholderTextColor="#A0A0A0"
            value={rua}
            onChangeText={setRua}
          />
        </View>

        {/* Número e Complemento */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Número *</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#A0A0A0"
              value={numero}
              onChangeText={setNumero}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.inputLabel}>Complemento</Text>
            <TextInput
              style={styles.input}
              placeholder="Apto, bloco, casa..."
              placeholderTextColor="#A0A0A0"
              value={complemento}
              onChangeText={setComplemento}
            />
          </View>
        </View>

        {/* Bairro */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bairro *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do bairro"
            placeholderTextColor="#A0A0A0"
            value={bairro}
            onChangeText={setBairro}
          />
        </View>

        {/* Cidade e Estado */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 3, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Cidade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da cidade"
              placeholderTextColor="#A0A0A0"
              value={cidade}
              onChangeText={setCidade}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1.5 }]}>
            <Text style={styles.inputLabel}>UF *</Text>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setShowStateModal(true)}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !estado && { color: "#A0A0A0" }
                ]}
              >
                {estado || "UF"}
              </Text>
              <Feather name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>SALVAR ENDEREÇO</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* State Picker Modal */}
      <Modal
        visible={showStateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Estado (UF)</Text>
              <TouchableOpacity onPress={() => setShowStateModal(false)} style={styles.closeModalBtn}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={ESTADOS_BRASIL}
              keyExtractor={(item) => item.uf}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.stateOption,
                    estado === item.uf && styles.stateOptionSelected
                  ]}
                  onPress={() => {
                    setEstado(item.uf);
                    setShowStateModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.stateOptionText,
                      estado === item.uf && styles.stateOptionTextSelected
                    ]}
                  >
                    {item.nome} ({item.uf})
                  </Text>
                  {estado === item.uf && <Feather name="check" size={18} color="#5C4033" />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formInstructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownTriggerText: {
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: "#5C4033",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "75%",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeModalBtn: {
    padding: 4,
  },
  stateOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  stateOptionSelected: {
    backgroundColor: "#FDF9F6",
  },
  stateOptionText: {
    fontSize: 16,
    color: "#333",
  },
  stateOptionTextSelected: {
    fontWeight: "bold",
    color: "#5C4033",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
