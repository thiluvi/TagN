import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function Enderecos({ navigation }: any) {
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnderecos = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (!storedUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        navigation.navigate("Login");
        return;
      }
      const user = JSON.parse(storedUser);
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/enderecos/usuario/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setEnderecos(data);
      } else {
        console.error("Erro ao listar endereços da API");
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar endereços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnderecos();
    }, [])
  );

  const handleDelete = (id: number) => {
    const performDelete = async () => {
      try {
        const URL_BACKEND = "http://localhost:8080";
        const response = await fetch(`${URL_BACKEND}/enderecos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Alert.alert("Sucesso", "Endereço excluído com sucesso.");
          fetchEnderecos();
        } else {
          Alert.alert("Erro", "Não foi possível excluir o endereço.");
        }
      } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        Alert.alert("Erro", "Erro ao conectar ao servidor.");
      }
    };

    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir este endereço?");
      if (confirmDelete) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Confirmar exclusão",
        "Tem certeza que deseja excluir este endereço?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: performDelete,
          },
        ]
      );
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.addressCard}>
      <View style={styles.addressInfo}>
        <View style={styles.addressHeader}>
          <Feather name="map-pin" size={18} color="#5C4033" />
          <Text style={styles.addressTitle}>Endereço</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {item.rua}, {item.numero}
        </Text>
        {item.complemento ? (
          <Text style={styles.addressSubtext}>Complemento: {item.complemento}</Text>
        ) : null}
        <Text style={styles.addressSubtext}>
          {item.bairro} - {item.cidade}/{item.estado}
        </Text>
        <Text style={styles.addressCep}>CEP: {item.cep}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("NovoEndereco", { address: item })}
        >
          <Feather name="edit" size={18} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash-2" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5C4033" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {enderecos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="map" size={40} color="#fff" />
              </View>
              <Text style={styles.emptyTitle}>Nenhum Endereço Salvo</Text>
              <Text style={styles.emptyText}>
                Cadastre seus endereços de entrega para facilitar suas compras.
              </Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate("NovoEndereco")}
              >
                <Text style={styles.addBtnText}>Adicionar Endereço</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={enderecos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
              <View style={styles.footer} pointerEvents="box-none">
                <TouchableOpacity
                  style={styles.addBtnFloating}
                  onPress={() => navigation.navigate("NovoEndereco")}
                >
                  <Feather name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.addBtnText}>Adicionar Novo Endereço</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#CBA38E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  addBtn: {
    backgroundColor: "#5C4033",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  addressInfo: {
    flex: 1,
    paddingRight: 10,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5C4033",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  addressSubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  addressCep: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  actionBtn: {
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#FFF0F0",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },
  addBtnFloating: {
    backgroundColor: "#5C4033",
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
