import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function AdminProdutos({ navigation }: any) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      setIsLoading(true);
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/produtos`);
      
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
        setFilteredProdutos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = produtos.filter(p => 
        p.nome.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProdutos(filtered);
    } else {
      setFilteredProdutos(produtos);
    }
  };

  const handleDelete = (id: number, nome: string) => {
    Alert.alert(
      "Excluir Produto",
      `Tem certeza que deseja excluir '${nome}'?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const URL_BACKEND = "http://localhost:8080";
              const response = await fetch(`${URL_BACKEND}/produtos/${id}`, {
                method: 'DELETE',
              });
              if (response.ok || response.status === 204) {
                Alert.alert("Sucesso", "Produto excluído.");
                fetchProdutos(); // Recarrega
              } else {
                Alert.alert("Erro", "Não foi possível excluir o produto.");
              }
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert("Erro", "Falha de conexão.");
            }
          }
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: any }) => {
    const isOutOfStock = item.quantidade === 0;
    const isLowStock = item.quantidade > 0 && item.quantidade <= 5;

    return (
      <View style={styles.productCard}>
        <Image 
          source={{ uri: item.imagem }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.productPrice}>R$ {Number(item.preco).toFixed(2).replace(".", ",")}</Text>
          
          <View style={styles.badgesRow}>
            {isOutOfStock ? (
              <View style={[styles.stockBadge, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[styles.stockBadgeText, { color: "#991B1B" }]}>Sem Estoque</Text>
              </View>
            ) : isLowStock ? (
              <View style={[styles.stockBadge, { backgroundColor: "#FEF3C7" }]}>
                <Text style={[styles.stockBadgeText, { color: "#92400E" }]}>Baixo: {item.quantidade}</Text>
              </View>
            ) : (
              <View style={[styles.stockBadge, { backgroundColor: "#D1FAE5" }]}>
                <Text style={[styles.stockBadgeText, { color: "#065F46" }]}>Estoque: {item.quantidade}</Text>
              </View>
            )}
            <View style={[styles.stockBadge, { backgroundColor: "#F3F4F6", marginLeft: 8 }]}>
                <Text style={[styles.stockBadgeText, { color: "#374151" }]}>{item.categoria}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: "#DBEAFE" }]}
            onPress={() => navigation.navigate("AdminProdutoForm", { produto: item })}
          >
            <Feather name="edit-2" size={16} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: "#FEE2E2", marginTop: 8 }]}
            onPress={() => handleDelete(item.id, item.nome)}
          >
            <Feather name="trash-2" size={16} color="#991B1B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Feather name="x" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#CBA38E" />
        </View>
      ) : (
        <FlatList
          data={filteredProdutos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          }
        />
      )}

      {/* FAB - Add Product */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("AdminProdutoForm")}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // espaço para o FAB
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: "row",
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionsContainer: {
    marginLeft: 12,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#CBA38E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
