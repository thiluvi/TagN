import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

export function AdminProdutoForm({ route, navigation }: any) {
  // Se vier com produto, é edição. Se não, é criação.
  const produtoEdit = route.params?.produto;
  const isEditing = !!produtoEdit;

  const [nome, setNome] = useState(produtoEdit?.nome || "");
  const [descricao, setDescricao] = useState(produtoEdit?.descricao || "");
  const [imagem, setImagem] = useState(produtoEdit?.imagem || "");
  const [preco, setPreco] = useState(produtoEdit?.preco?.toString() || "");
  const [quantidade, setQuantidade] = useState(produtoEdit?.quantidade?.toString() || "0");
  const [categoria, setCategoria] = useState(produtoEdit?.categoria || "Anéis");

  const [isSaving, setIsSaving] = useState(false);

  const CATEGORIAS = ["Anéis", "Pulseiras", "Colares", "Brincos", "Relógios"];

  const handleSave = async () => {
    if (!nome || !descricao || !imagem || !preco || !quantidade) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);
    try {
      const URL_BACKEND = "http://localhost:8080";
      
      const payload = {
        nome,
        descricao,
        imagem,
        preco: parseFloat(preco.replace(",", ".")),
        quantidade: parseInt(quantidade, 10),
        categoria
      };

      const url = isEditing ? `${URL_BACKEND}/produtos/${produtoEdit.id}` : `${URL_BACKEND}/produtos`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok || response.status === 201) {
        Alert.alert("Sucesso", `Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        navigation.goBack();
      } else {
        const errorText = await response.text();
        Alert.alert("Erro", errorText || "Não foi possível salvar o produto.");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Editar Produto" : "Novo Produto"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Anel Masculino Prata"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={preco}
                onChangeText={setPreco}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Quantidade em Estoque</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryBadge, categoria === cat && styles.categoryBadgeActive]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[styles.categoryText, categoria === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL da Imagem</Text>
            <TextInput
              style={styles.input}
              placeholder="https://exemplo.com/imagem.png"
              value={imagem}
              onChangeText={setImagem}
              autoCapitalize="none"
              keyboardType="url"
            />
            {imagem.length > 0 && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview da Imagem:</Text>
                <Image 
                  source={{ uri: imagem }} 
                  style={styles.previewImage} 
                  resizeMode="contain" 
                />
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalhes do produto..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{isSaving ? "Salvando..." : "Salvar Produto"}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    minHeight: 100,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  categoryBadgeActive: {
    backgroundColor: "#5C4033",
  },
  categoryText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFF",
  },
  previewContainer: {
    marginTop: 12,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  previewLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#CBA38E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
