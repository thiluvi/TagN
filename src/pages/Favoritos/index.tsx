import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, FlatList, Image, Dimensions, Alert } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; 

export function Favoritos({ navigation }: any) {
  // pegando as funcoes e a lista do carrinho global
  const { favoriteItems, toggleFavorite, addToCart } = useShop();
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

  // joga o item pra sacola e mostra um alerta
  const handleAddToCart = async (item: any) => {
    const success = await addToCart(item, 1);
    if (success) {
      Alert.alert("Na Sacola!", `${item.name} foi adicionado à sacola.`);
    }
  };

  const renderItem = ({ item }: any) => (
    // cardzinho do produto
    <View style={styles.favCard}>
      <TouchableOpacity 
        style={styles.heartBtn} 
        onPress={() => toggleFavorite(item)}
      >
        <Ionicons name="heart" size={20} color="red" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>

      {/* botao de jogar direto pra sacola */}
      <TouchableOpacity 
        style={styles.addToCartBtn} 
        onPress={() => handleAddToCart(item)}
      >
        <Feather name="shopping-bag" size={14} color="#fff" />
        <Text style={styles.addToCartText}>Mover p/ Sacola</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* barra la em cima com titulo e botao de voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* se a lista tiver vazia mostra a telinha de aviso */}
      {!isLoggedIn ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Faça Login para Favoritar</Text>
          <Text style={styles.emptyText}>Conecte-se para salvar suas joias e peças favoritas em sua conta.</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.exploreBtnText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      ) : favoriteItems.length === 0 ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Nenhum Favorito Ainda</Text>
          <Text style={styles.emptyText}>Que tal explorar as novidades e salvar as peças que você mais gostar?</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.exploreBtnText}>Explorar Coleção</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // se tiver itens renderiza a lista grid bolada
        <View style={styles.listContainer}>
          <FlatList
            data={favoriteItems}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // fundo meio cinza pra destacar os cards brancos
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
    paddingBottom: 120, // espaço extra senao a barra de baixo esconde a ultima linha
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  favCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3, // sombrinha massa no android
    position: "relative",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
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
    width: "100%",
    height: 110,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: "80%",
    height: "80%",
  },
  itemInfo: {
    flex: 1,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    height: 36, // tamanho fixo senao um card fica maior que o outro e buga o grid
  },
  itemPrice: {
    fontSize: 14,
    color: "#5C4033",
    fontWeight: "900",
  },
  addToCartBtn: {
    flexDirection: "row",
    backgroundColor: "#CBA38E",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
