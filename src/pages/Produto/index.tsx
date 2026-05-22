import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useShop } from "../../context/ShopContext";

export function Produto({ route, navigation }: any) {
  // pegando os dados do produto q o cara clicou na home (se der pau tem um padrao ai pra testar)
  const product = route.params?.product || {
    name: "Anel Masculino Linha Dupla em Aço",
    price: "R$ 199,99",
    image: require("../../assets/Utilitarios/banner anel.png"),
    category: "Anéis",
    description: "Anel Masculino Linha Dupla em Aço\nAltura: 6,00(mm)",
  };

  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleFavorite, isFavorite } = useShop();

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // joga pra sacola passando a quantidade certinha
  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert("Sucesso", "Produto adicionado à sacola!");
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigation.navigate("Pagamento");
  };

  const isFav = isFavorite(product.name);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* barra de cima com botao de voltar, favoritar e compartilhar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.category}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => toggleFavorite(product)} style={styles.iconButton}>
            {isFav ? (
              <Ionicons name="heart" size={24} color="red" />
            ) : (
              <Ionicons name="heart-outline" size={24} color="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* fotona principal do produto */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.mainImage} resizeMode="cover" />
        </View>


        <View style={styles.thumbnailContainer}>
          <View style={[styles.thumbnailWrapper, styles.thumbnailActive]}>
            <Image source={product.image} style={styles.thumbnail} resizeMode="cover" />
          </View>
          <View style={styles.thumbnailWrapper}>
            <Image source={product.image} style={styles.thumbnail} resizeMode="cover" />
          </View>
        </View>


        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>

          {/* botoes pra escolher se quer mais de 1 (qtd) */}
          <View style={styles.selectorsRow}>
            <Text style={styles.selectorLabel}>Quantidade:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyButton}>
                <Feather name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity} style={styles.qtyButton}>
                <Feather name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>


          <Text style={styles.description}>{product.description}</Text>



          <View style={styles.actionButtonsRow}>
            <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>ADICIONAR AO CARRINHO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowButton}>
              <Text style={styles.buyNowText}>COMPRAR AGORA</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailActive: {
    borderColor: "#000",
    borderWidth: 2,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  selectorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sizeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectorLabel: {
    fontSize: 14,
    color: "#333",
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  sizeButtonText: {
    fontSize: 14,
    color: "#333",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
  },
  qtyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    minWidth: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 30,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#CBA38E",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#5C4033",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buyNowText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
