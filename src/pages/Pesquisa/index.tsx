import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export function Pesquisa({ navigation }: any) {
  // 1. Definições de Estado da Página de Pesquisa
  const [produtos, setProdutos] = useState<any[]>([]); // Lista bruta de todos os produtos buscados da API
  const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]); // Lista de produtos exibidos após filtros aplicados
  const [isLoading, setIsLoading] = useState(true); // Controla a exibição do loading spinner
  const [searchQuery, setSearchQuery] = useState(""); // Texto digitado pelo usuário na barra de pesquisa
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Categoria selecionada no carrossel superior

  // Produtos estáticos de Fallback para que a pesquisa funcione mesmo offline
  const fallbackProducts = [
    {
      name: "Anel Masculino Linha Silver",
      price: "R$ 199,99",
      image: require("../../assets/Utilitarios/banner anel.png"),
      category: "Anéis",
      description: "Anel Masculino Linha Silver em Aço Inoxidável.\nAltura: 6,00(mm)",
    },
    {
      name: "Pulseira Clássica Gold",
      price: "R$ 179,99",
      image: require("../../assets/Utilitarios/banner pulseira.png"),
      category: "Pulseiras",
      description: "Pulseira Clássica Gold Banhada a Ouro 18k.\nComprimento: 19cm",
    },
    {
      name: "Relógio Classic Black",
      price: "R$ 349,90",
      image: require("../../assets/Utilitarios/banner relogio.png"),
      category: "Relógios",
      description: "Relógio Analógico Masculino Premium.\nResistente à água 5ATM.",
    },
    {
      name: "Corrente Aço Inoxidável",
      price: "R$ 129,90",
      image: require("../../assets/Utilitarios/banner colar.png"),
      category: "Colares",
      description: "Corrente Masculina em Aço Inoxidável 316L.\nComprimento: 60cm.",
    },
    {
      name: "Brinco Argola Ouro 18k",
      price: "R$ 259,90",
      image: require("../../assets/Utilitarios/banner brinco.png"),
      category: "Brincos",
      description: "Brinco Feminino estilo Argola com banho de Ouro 18k.",
    },
    {
      name: "Anel Solitário Prata 925",
      price: "R$ 149,90",
      image: require("../../assets/Utilitarios/banner anel.png"),
      category: "Anéis",
      description: "Anel Solitário Feminino em Prata 925 com zircônia central.",
    },
  ];

  /**
   * Helper: Normaliza strings eliminando caixa alta/baixa, espaços extras,
   * acentuação e caracteres especiais para comparação insensível a acentos.
   */
  const normalizeString = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  /**
   * Helper: Verifica equivalência de categorias considerando sinônimos (ex: Colares/Correntes).
   */
  const isCategoryMatch = (productCategory: string | undefined, selectedCat: string) => {
    if (!productCategory) return false;
    const pCat = normalizeString(productCategory);
    const sCat = normalizeString(selectedCat);
    if (pCat === sCat) return true;
    if (sCat === "colares" && pCat === "correntes") return true;
    if (sCat === "correntes" && pCat === "colares") return true;
    return false;
  };

  // 2. Efeito de carregamento: Busca todos os produtos do backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const URL_BACKEND = "http://192.168.15.4:8080";
        const response = await fetch(`${URL_BACKEND}/produtos`);
        if (response.ok) {
          const data = await response.json();
          setProdutos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos para pesquisa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  // 3. Mapeador: Normaliza os produtos vindos da API ou adota os fallbacks premium
  const mappedProducts = produtos.length > 0
    ? produtos.map((prod: any) => ({
        id: prod.id,
        name: prod.nome,
        price: `R$ ${Number(prod.preco).toFixed(2).replace(".", ",")}`,
        image: { uri: prod.imagem },
        category: prod.categoria,
        description: prod.descricao,
      }))
    : fallbackProducts;

  // 4. Lógica de Filtragem Reativa em tempo real (roda ao mudar query, categoria ou banco de dados)
  useEffect(() => {
    let result = mappedProducts;

    // Filtra por Categoria se alguma estiver ativa
    if (selectedCategory) {
      result = result.filter((p) => isCategoryMatch(p.category, selectedCategory));
    }

    // Filtra por termo digitado pesquisando em Nome, Categoria e Descrição do produto
    if (searchQuery.trim() !== "") {
      const normalizedQuery = normalizeString(searchQuery);
      result = result.filter(
        (p) =>
          normalizeString(p.name).includes(normalizedQuery) ||
          normalizeString(p.category || "").includes(normalizedQuery) ||
          normalizeString(p.description || "").includes(normalizedQuery)
      );
    }

    setFilteredProdutos(result);
  }, [searchQuery, selectedCategory, produtos]);

  // Função para limpar o campo de busca e dispensar o teclado
  const handleClearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const renderProductCard = (product: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.productCard}
      onPress={() => navigation.navigate("Produto", { product })}
    >
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productPrice}>{product.price}</Text>
    </TouchableOpacity>
  );

  const categories = [
    { name: "Todos", value: null },
    { name: "Relógios", value: "Relógios" },
    { name: "Anéis", value: "Anéis" },
    { name: "Pulseiras", value: "Pulseiras" },
    { name: "Colares", value: "Colares" },
    { name: "Brincos", value: "Brincos" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Header de Pesquisa */}
          <View style={styles.header}>
            <View style={styles.searchBarContainer}>
              <Feather name="search" size={20} color="#777777" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar joias, relógios, anéis..."
                placeholderTextColor="#A0A0A0"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                  <Feather name="x-circle" size={18} color="#777777" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Categorias rápidas horizontais */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((cat, index) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryTag,
                      isSelected && styles.categoryTagActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.value)}
                  >
                    <Text
                      style={[
                        styles.categoryTagText,
                        isSelected && styles.categoryTagTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Listagem de Resultados */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#5C4033" />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredProdutos.length > 0 ? (
                <>
                  <Text style={styles.resultCountText}>
                    {filteredProdutos.length}{" "}
                    {filteredProdutos.length === 1 ? "produto encontrado" : "produtos encontrados"}
                  </Text>

                  <View style={styles.productsGrid}>
                    {filteredProdutos.map((prod, index) => renderProductCard(prod, index))}
                  </View>
                </>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Feather name="search" size={40} color="#FFFFFF" />
                  </View>
                  <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    Tente digitar palavras diferentes ou limpe os filtros para explorar outras coleções.
                  </Text>
                  <TouchableOpacity
                    style={styles.btnReset}
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    <Text style={styles.btnResetText}>LIMPAR BUSCA</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 20,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333333",
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  categoryTagActive: {
    backgroundColor: "#5C4033",
    borderColor: "#5C4033",
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555555",
  },
  categoryTagTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço extra para a Tab Bar inferior flutuante
  },
  resultCountText: {
    fontSize: 13,
    color: "#777777",
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 50) / 2,
    backgroundColor: "#FDFDFD",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#444444",
    marginTop: 8,
    marginBottom: 4,
    height: 36, // Altura fixa para 2 linhas de texto alinhadas
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5C4033",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#CBA38E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 25,
  },
  btnReset: {
    backgroundColor: "#5C4033",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  btnResetText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
});
