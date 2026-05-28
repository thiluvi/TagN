import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export function AdminDashboard({ navigation }: any) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/admin/dashboard`);
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return "R$ 0,00";
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
  };

  const renderRecentOrder = ({ item }: { item: any }) => {
    const orderDate = new Date(item.data);
    const formattedDate = orderDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Pedido #{item.id}</Text>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Feather name="user" size={14} color="#666" />
          <Text style={styles.userName}>{item.usuario?.nome || "Usuário não informado"}</Text>
        </View>

        {item.endereco && (
          <View style={styles.addressInfo}>
            <Feather name="map-pin" size={14} color="#666" />
            <Text style={styles.addressText}>
              {item.endereco.rua}, {item.endereco.numero} - {item.endereco.bairro}, {item.endereco.cidade}/{item.endereco.estado}
            </Text>
          </View>
        )}

        {item.itens && item.itens.length > 0 && (
          <View style={styles.itemsContainer}>
            {item.itens.map((itemPedido: any, idx: number) => (
              <View key={idx} style={styles.itemRow}>
                <Image 
                  source={{ uri: itemPedido.produto?.imagem }} 
                  style={styles.itemImage} 
                  resizeMode="contain" 
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{itemPedido.produto?.nome}</Text>
                  <Text style={styles.itemQty}>Qtd: {itemPedido.quantidade}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>{item.formaPagamento}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel Administrativo</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#CBA38E" />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {/* KPIs */}
              <View style={styles.kpiContainer}>
                <View style={styles.kpiRow}>
                  <View style={[styles.kpiCard, { backgroundColor: "#2C2C4E" }]}>
                    <Feather name="dollar-sign" size={24} color="#4ADE80" style={styles.kpiIcon} />
                    <Text style={styles.kpiLabel}>Receita Total</Text>
                    <Text style={styles.kpiValue}>{formatCurrency(dashboardData?.receitaTotal)}</Text>
                  </View>
                  <View style={[styles.kpiCard, { backgroundColor: "#2C2C4E" }]}>
                    <Feather name="shopping-bag" size={24} color="#60A5FA" style={styles.kpiIcon} />
                    <Text style={styles.kpiLabel}>Total Pedidos</Text>
                    <Text style={styles.kpiValue}>{dashboardData?.totalPedidos || 0}</Text>
                  </View>
                </View>

                <View style={styles.kpiRow}>
                  <View style={[styles.kpiCard, { backgroundColor: "#2C2C4E" }]}>
                    <Feather name="box" size={24} color="#A78BFA" style={styles.kpiIcon} />
                    <Text style={styles.kpiLabel}>Total Produtos</Text>
                    <Text style={styles.kpiValue}>{dashboardData?.totalProdutos || 0}</Text>
                  </View>
                  <View style={[styles.kpiCard, { backgroundColor: "#2C2C4E" }]}>
                    <Feather name="alert-triangle" size={24} color="#F87171" style={styles.kpiIcon} />
                    <Text style={styles.kpiLabel}>Estoque Baixo (≤5)</Text>
                    <Text style={[styles.kpiValue, dashboardData?.produtosEstoqueBaixo > 0 && { color: "#F87171" }]}>
                      {dashboardData?.produtosEstoqueBaixo || 0}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botão de gerenciar produtos */}
              <TouchableOpacity 
                style={styles.manageProductsBtn}
                onPress={() => navigation.navigate("AdminProdutos")}
              >
                <Feather name="layers" size={20} color="#FFF" />
                <Text style={styles.manageProductsText}>Gerenciar Produtos</Text>
                <Feather name="chevron-right" size={20} color="#FFF" style={{ marginLeft: "auto" }} />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
            </>
          }
          data={dashboardData?.pedidosRecentes || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecentOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C4E",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  kpiContainer: {
    gap: 12,
    marginBottom: 20,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  kpiIcon: {
    marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  manageProductsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CBA38E",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  manageProductsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: "#2C2C4E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  orderDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  userName: {
    fontSize: 14,
    color: "#E5E7EB",
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: "#9CA3AF",
    flex: 1,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#3F3F6A",
    paddingTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    padding: 8,
    borderRadius: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#3F3F6A",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  itemQty: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3F3F6A",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4ADE80",
  },
  paymentBadge: {
    backgroundColor: "#3F3F6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentBadgeText: {
    fontSize: 12,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
});
