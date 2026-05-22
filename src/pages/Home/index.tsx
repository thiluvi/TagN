import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  // 1. Definições de Estado da Página
  const [produtos, setProdutos] = useState<any[]>([]); // Produtos recebidos do backend
  const [isLoading, setIsLoading] = useState(true); // Controla o indicador de carregamento
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Categoria selecionada para filtro

  /**
   * Helper: Normaliza strings removendo acentuações e caracteres especiais
   * para fazer comparações de busca de forma robusta e limpa.
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
   * Helper: Verifica se a categoria do produto bate com a categoria selecionada.
   * Contempla sinônimos como 'Colares' e 'Correntes' para melhor usabilidade.
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

  // Produtos de Fallback para exibir na Home caso a API do backend não esteja ativa/conectada
  const fallbackProducts = [
    {
      name: "Anel Masculino Linha Silverrrr",
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

  // 2. Busca inicial de produtos do banco de dados (Spring Boot)
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
        console.error("Erro ao buscar produtos da API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // 3. Mapeamento de Produtos da API (para bater com o formato consumido pelo layout)
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

  // 4. Separação de Listas Específicas para Seções da Home
  const destaques = mappedProducts.slice(0, 4);

  const masculino = mappedProducts.filter((p: any) =>
    p.name.toLowerCase().includes("masculin") ||
    p.name.toLowerCase().includes("hunter") ||
    p.name.toLowerCase().includes("medalhão")
  );

  const feminino = mappedProducts.filter((p: any) =>
    (p.name.toLowerCase().includes("feminin") ||
      p.name.toLowerCase().includes("solitári") ||
      p.name.toLowerCase().includes("argola") ||
      p.name.toLowerCase().includes("seiko dourado") ||
      p.name.toLowerCase().includes("seiko minimalista")) &&
    !p.name.toLowerCase().includes("masculin")
  );

  // 5. Função de Renderização dos Cards Individuais de Produto
  const renderProductCard = (product: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.productCard}
      onPress={() => navigation.navigate("Produto", { product })}
    >
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
    </TouchableOpacity>
  );

  // 6. Sub-renderizador: Banner Superior de Promoção
  const renderBanner = () => (
    <ImageBackground
      source={require("../../assets/Utilitarios/fundo_banner3.png")}
      style={styles.bannerContainer}
      resizeMode="stretch"
    >
      <View style={styles.overlay} />
      <View style={styles.header} />

      <View style={styles.heroTextContainer}>
        <Text style={styles.heroSubtitle}>PRIMEIRA COMPRA</Text>
        <Text style={styles.heroTitle}>
          DESCONTO DE <Text style={styles.goldText}>20%</Text>
        </Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>+ FRETE GRÁTIS</Text>
        </View>
      </View>
    </ImageBackground>
  );

  // 7. Sub-renderizador: Conteúdo Principal (Categorias e Grades de Produtos)
  const renderContent = () => (
    <View style={styles.contentWrapper}>
      {/* Faixa promocional preta */}
      <View style={styles.promoBanner}>
        <MaterialCommunityIcons name="truck" size={24} color="#fff" />
        <Text style={styles.promoText}>
          Frete grátis em compras acima de R$300 no app
        </Text>
      </View>

      {/* Lista horizontal de seleção de categorias */}
      <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {[
          { name: "Todos", isAll: true },
          { name: "Relógios", img: require("../../assets/Utilitarios/banner relogio.png") },
          { name: "Anéis", img: require("../../assets/Utilitarios/banner anel.png") },
          { name: "Pulseiras", img: require("../../assets/Utilitarios/banner pulseira.png") },
          { name: "Colares", img: require("../../assets/Utilitarios/banner colar.png") },
          { name: "Brincos", img: require("../../assets/Utilitarios/banner brinco.png") },
        ].map((item, index) => {
          const isActive = item.isAll ? (selectedCategory === null) : (selectedCategory === item.name);
          return (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => setSelectedCategory(item.isAll ? null : item.name)}
            >
              {item.isAll ? (
                <View style={[
                  styles.categoryIconContainer,
                  isActive && styles.categoryIconContainerActive
                ]}>
                  <Ionicons name="grid-outline" size={28} color={isActive ? "#000" : "#333"} />
                </View>
              ) : (
                <Image
                  source={item.img}
                  style={[
                    styles.categoryImage,
                    isActive && styles.categoryImageActive
                  ]}
                />
              )}
              <Text style={[
                styles.categoryName,
                isActive && styles.categoryNameActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exibição condicional da lista de produtos de acordo com a categoria selecionada */}
      {isLoading ? (
        <View style={{ paddingVertical: 50, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#5C4033" />
        </View>
      ) : (
        <>
          {selectedCategory ? (
            <>
              {/* Layout para categoria selecionada individualmente */}
              <View style={styles.destaqueSection}>
                <Text style={styles.destaqueTitulo}>{selectedCategory.toUpperCase()}</Text>
                <View style={styles.destaqueLine} />
              </View>

              {mappedProducts.filter((p: any) => isCategoryMatch(p.category, selectedCategory)).length > 0 ? (
                <View style={styles.productsGrid}>
                  {mappedProducts
                    .filter((p: any) => isCategoryMatch(p.category, selectedCategory))
                    .map((prod, index) => renderProductCard(prod, index))}
                </View>
              ) : (
                <View style={{ paddingVertical: 50, alignItems: "center" }}>
                  <Text style={{ color: "#666", fontSize: 16 }}>Nenhum produto encontrado nesta categoria.</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Layout padrão da Home com divisões Destaques, Masculino e Feminino */}
              {/* DESTAQUES */}
              <View style={styles.destaqueSection}>
                <Text style={styles.destaqueTitulo}>DESTAQUES</Text>
                <View style={styles.destaqueLine} />
              </View>

              <View style={styles.productsGrid}>
                {destaques.map((prod, index) => renderProductCard(prod, index))}
              </View>

              {/* MASCULINO */}
              <View style={styles.destaqueSection}>
                <Text style={styles.destaqueTitulo}>MASCULINO</Text>
                <View style={styles.destaqueLine} />
              </View>

              <View style={styles.productsGrid}>
                {masculino.map((prod, index) => renderProductCard(prod, index))}
              </View>

              {/* FEMININO */}
              <View style={styles.destaqueSection}>
                <Text style={styles.destaqueTitulo}>FEMININO</Text>
                <View style={styles.destaqueLine} />
              </View>

              <View style={styles.productsGrid}>
                {feminino.map((prod, index) => renderProductCard(prod, index))}
              </View>
            </>
          )}
        </>
      )}

      {/* Rodapé institucional com informações autorais */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>TagN Joias</Text>
        <Text style={styles.footerSubText}>Coleções exclusivas para todos os momentos © 2026 TagN</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* FlatList geral empilhando o banner de topo e o conteúdo abaixo */}
      <FlatList
        data={[{ id: "banner" }, { id: "content" }]}
        renderItem={({ item }) => (item.id === "banner" ? renderBanner() : renderContent())}
        keyExtractor={(item) => item.id}
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
  contentWrapper: {
    width: width,
    backgroundColor: "#fff",
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
    marginTop: 40,
  },
  heroTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "30%",
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 4,
    fontWeight: "300",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  goldText: {
    color: "#d4af37",
    fontSize: 48,
  },
  heroBadge: {
    backgroundColor: "#d4af37",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 20,
  },
  heroBadgeText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 20,
    color: "#000",
  },


  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
  },
  categoryImageActive: {
    borderWidth: 2.5,
    borderColor: "#d4af37",
  },
  categoryName: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  categoryNameActive: {
    color: "#d4af37",
    fontWeight: "bold",
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconContainerActive: {
    backgroundColor: "#d4af37",
  },


  destaqueSection: {
    paddingVertical: 20,
    alignItems: "center",
  },
  destaqueTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  destaqueLine: {
    width: 40,
    height: 3,
    backgroundColor: "#d4af37",
    marginTop: 5,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 40) / 2,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 4,
  },
  productName: {
    fontSize: 13,
    color: "#444",
    marginVertical: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  // rodapezinho padrao da pagina
  footer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: 20,
  },
  footerText: {
    fontWeight: "bold",
    color: "#333",
  },
  footerSubText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});