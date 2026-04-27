import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export function Home({ navigation }: any) {
  const renderBanner = () => (
    <ImageBackground
      source={require("../../assets/Utilitarios/fundo banner1.png")}
      style={styles.bannerContainer}
      resizeMode="stretch"
    >
      <View style={styles.overlay} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderContent = () => (
    <View style={styles.contentWrapper}>
      {/* Banner Frete Grátis */}
      <View style={styles.promoBanner}>
        <MaterialCommunityIcons name="truck" size={24} color="#fff" />
        <Text style={styles.promoText}>
          Frete grátis em compras acima de R$300 no app
        </Text>
      </View>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <View style={styles.categoryCard}>
          <Image
            source={require("../../assets/Utilitarios/banner relogio.png")}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryName}>Relógios</Text>
        </View>
        <View style={styles.categoryCard}>
          <Image
            source={require("../../assets/Utilitarios/banner anel.png")}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryName}>Anéis</Text>
        </View>
        <View style={styles.categoryCard}>
          <Image
            source={require("../../assets/Utilitarios/banner pulseira.png")}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryName}>Pulseiras</Text>
        </View>
        <View style={styles.categoryCard}>
          <Image
            source={require("../../assets/Utilitarios/banner colar.png")}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryName}>Colares</Text>
        </View>
        <View style={styles.categoryCard}>
          <Image
            source={require("../../assets/Utilitarios/banner brinco.png")}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryName}>Brincos</Text>
        </View>
      </ScrollView>

      {/* Destaque */}
      <View style={styles.destaqueSection}>
        <Text style={styles.destaqueTitulo}>destaque</Text>
        <View style={styles.destaqueLine} />
      </View>

      {/* Produtos Grid */}
      <View style={styles.productsGrid}>
        <View style={styles.productCard}>
          <Image
            source={require("../../assets/Utilitarios/banner anel.png")}
            style={styles.productImage}
          />
          <Text style={styles.productName}>Anel Masculino Linha...</Text>
          <Text style={styles.productPrice}>R$ 199,99</Text>
        </View>
        <View style={styles.productCard}>
          <Image
            source={require("../../assets/Utilitarios/banner pulseira.png")}
            style={styles.productImage}
          />
          <Text style={styles.productName}>Pulseira clássica</Text>
          <Text style={styles.productPrice}>R$ 179,99</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <FlatList
        data={[{ id: "banner" }, { id: "content" }]}
        renderItem={({ item }) =>
          item.id === "banner" ? renderBanner() : renderContent()
        }
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  bannerContainer: {
    width: width,
    height: height,
    justifyContent: "flex-start",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    marginTop: "10%",
  },
  contentWrapper: {
    width: width,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  promoBanner: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  promoText: {
    color: "#fff",
    fontSize: 13,
    flex: 1,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  destaqueSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  destaqueTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  destaqueLine: {
    width: 60,
    height: 2,
    backgroundColor: "#d4af37",
  },
  productsGrid: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 12,
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  productName: {
    fontSize: 12,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
