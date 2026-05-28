import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, FlatList, Image, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Sacola({ navigation }: any) {
  const { cartItems, removeFromCart, updateQuantity } = useShop();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkUser = async () => {
        const storedUser = await AsyncStorage.getItem("@tagn_user");
        setIsLoggedIn(!!storedUser);
      };
      checkUser();
    }, [])
  );

  // faz a conta de quanto vai dar essa brincadeira toda (subtotal)
  const subtotal = cartItems.reduce((acc, item) => {
    // pegando o preco que ta em texto e arrumando pra numero pra poder somar
    const priceStr = item.price.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
    const priceNum = parseFloat(priceStr);
    return acc + (priceNum * item.quantity);
  }, 0);

  const formattedSubtotal = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

  // desenha o cardzinho pra cada item q tiver na sacola
  const renderItem = ({ item }: any) => {
    const itemStock = item.stock ?? Infinity;
    const atStockLimit = item.quantity >= itemStock;

    return (
      <View style={styles.cartCard}>
        {/* botaozin de apagar da sacola se desistir de comprar */}
        <TouchableOpacity 
          style={styles.trashBtn} 
          onPress={() => removeFromCart(item.name)}
        >
          <Feather name="trash-2" size={18} color="#cc0000" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
        </View>
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
          
          {/* botoes de mais e menos pra aumentar qtd do msm produto */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity - 1)} style={styles.qtyBtn}>
              <Feather name="minus" size={16} color="#000" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                if (atStockLimit) {
                  Alert.alert("Limite de Estoque", `Apenas ${itemStock} unidade(s) disponível(is) em estoque.`);
                  return;
                }
                updateQuantity(item.name, item.quantity + 1);
              }}
              style={[styles.qtyBtn, atStockLimit && styles.qtyBtnDisabled]}
            >
              <Feather name="plus" size={16} color={atStockLimit ? "#ccc" : "#000"} />
            </TouchableOpacity>
          </View>

          {/* Indicador de estoque baixo */}
          {itemStock <= 5 && itemStock > 0 && (
            <Text style={styles.lowStockText}>Restam {itemStock} em estoque</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* topo da pagina q fala onde tamo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Sacola</Text>
        <View style={{ width: 24 }} />
      </View>

   
      {!isLoggedIn ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Faça Login para Comprar</Text>
          <Text style={styles.emptyText}>Você precisa estar conectado para adicionar produtos e finalizar compras.</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.exploreBtnText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="shopping-bag" size={40} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Sua Sacola está Vazia</Text>
          <Text style={styles.emptyText}>Que tal explorar as novidades e adicionar as peças que você mais gostar?</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.exploreBtnText}>Explorar Coleção</Text>
          </TouchableOpacity>
        </View>
      ) : (
       
        <>
          <View style={styles.listContainer}>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.name}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
          
        
          <View style={styles.footerContainer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formattedSubtotal}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutBtn} 
              onPress={() => navigation.navigate("Pagamento")}
            >
              <Text style={styles.checkoutBtnText}>Seguir para o Pagamento</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    padding: 5,
  },
  content: {
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
  exploreBtn: {
    backgroundColor: "#5C4033",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
  },
  trashBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  itemImage: {
    width: "90%",
    height: "90%",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
    minHeight: 90,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    paddingRight: 20, // espaco pra lixeirinha nao ficar em cima do nome
  },
  itemPrice: {
    fontSize: 15,
    color: "#5C4033",
    fontWeight: "900",
    marginBottom: 8,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    minWidth: 20,
    textAlign: "center",
  },
  footerContainer: {
    padding: 20,
    paddingBottom: 120, // empurrando o conteudo pra cima por causa da nav bar de baixo
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  subtotalLabel: {
    fontSize: 16,
    color: "#666",
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  checkoutBtn: {
    backgroundColor: "#5C4033",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  lowStockText: {
    fontSize: 11,
    color: "#E67E22",
    fontWeight: "bold",
    marginTop: 4,
  },
});
