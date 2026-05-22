import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Tipos para os pedidos
type OrderItem = {
  name: string;
  price: string;
  quantity: number;
  image: any;
};

type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: string;
  formaPagamento: string;
};

export function Pedidos({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const URL_BACKEND = "http://192.168.15.4:8080";
      
      const response = await fetch(`${URL_BACKEND}/pedidos/usuario/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        
        const mapped = data.map((order: any) => {
          // Format date: e.g. "22 de mai de 2026"
          const orderDate = new Date(order.data);
          const formattedDate = orderDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });

          const orderItems = order.itens.map((item: any) => ({
            name: item.produto.nome,
            price: `R$ ${Number(item.precoUnitario).toFixed(2).replace(".", ",")}`,
            quantity: item.quantidade,
            image: item.produto.imagem ? { uri: item.produto.imagem } : require("../../assets/Utilitarios/banner anel.png"),
          }));

          return {
            id: `#${order.id}`,
            date: formattedDate,
            total: `R$ ${Number(order.total).toFixed(2).replace(".", ",")}`,
            items: orderItems,
            formaPagamento: order.formaPagamento,
          };
        });
        
        setOrders(mapped);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "PIX":
        return "Pix";
      case "CREDIT_CARD":
        return "Cartão";
      case "BOLETO":
        return "Boleto";
      default:
        return method;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <View style={styles.orderCard}>
        {/* Topo do card com ID, data e forma de pagamento */}
        <View style={styles.orderCardHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>
              {getPaymentLabel(item.formaPagamento)}
            </Text>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Itens do pedido */}
        <View style={styles.productsList}>
          {item.items.map((prod, idx) => (
            <View key={idx} style={styles.productRow}>
              <View style={styles.productImageContainer}>
                <Image source={prod.image} style={styles.productImage} resizeMode="contain" />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text style={styles.productQtyPrice}>
                  Qtd: {prod.quantity} • {prod.price}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Rodapé do card com Total */}
        <View style={styles.orderCardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{item.total}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5C4033" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="package" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Você ainda não realizou compras em nossa loja.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: "#868E96",
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F1F3F5",
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },
  productsList: {
    padding: 16,
    gap: 12,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 2,
  },
  productQtyPrice: {
    fontSize: 12,
    color: "#868E96",
  },
  orderCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: "#868E96",
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#212529",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#CBA38E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#868E96",
    textAlign: "center",
    lineHeight: 20,
  },
});
