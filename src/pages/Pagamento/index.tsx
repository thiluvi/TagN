import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../../context/ShopContext";

export function Pagamento({ navigation }: any) {
  const { cartItems, refreshUserData } = useShop();

  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);

  // Parse price helper
  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  // Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (parsePrice(item.price) * item.quantity);
  }, 0);

  const formattedTotal = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

  const fetchAddresses = async () => {
    try {
      setIsAddressesLoading(true);
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/enderecos/usuario/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setEnderecos(data);
        if (data.length > 0) {
          // Auto select first address
          setSelectedAddress(data[0]);
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    } finally {
      setIsAddressesLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Copiado!", message);
    }
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Atenção", "Sua sacola está vazia.");
      return;
    }
    if (!selectedAddress) {
      Alert.alert("Atenção", "Por favor, selecione ou cadastre um endereço de entrega.");
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        Alert.alert("Campos obrigatórios", "Por favor, preencha todos os dados do cartão de crédito.");
        return;
      }
    }

    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const URL_BACKEND = "http://localhost:8080";

      const orderItems = cartItems.map((item) => ({
        produto: { id: item.id },
        quantidade: item.quantity,
        precoUnitario: parsePrice(item.price),
      }));

      const orderData = {
        usuario: { id: user.id },
        endereco: { id: selectedAddress.id },
        formaPagamento: paymentMethod,
        total: subtotal,
        itens: orderItems,
      };

      const response = await fetch(`${URL_BACKEND}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        if (Platform.OS === "web") {
          alert("Pedido realizado com sucesso!");
        } else {
          Alert.alert("Sucesso", "Pedido realizado com sucesso!");
        }
        await refreshUserData(); // Esvazia o carrinho no context local
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }, { name: "Pedidos" }],
        });
      } else {
        Alert.alert("Erro", "Não foi possível finalizar o pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finalizar Compra</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. Endereço de Entrega */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>1. Endereço de Entrega</Text>
              <TouchableOpacity onPress={() => navigation.navigate("NovoEndereco")}>
                <Text style={styles.addAddressText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>

            {isAddressesLoading ? (
              <ActivityIndicator size="small" color="#5C4033" style={{ padding: 10 }} />
            ) : enderecos.length === 0 ? (
              <View style={styles.noAddressContainer}>
                <Text style={styles.noAddressText}>Nenhum endereço cadastrado.</Text>
                <TouchableOpacity
                  style={styles.btnRegisterAddress}
                  onPress={() => navigation.navigate("NovoEndereco")}
                >
                  <Text style={styles.btnRegisterAddressText}>CADASTRAR ENDEREÇO</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addressList}>
                {enderecos.map((item) => {
                  const isSelected = selectedAddress?.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.addressCard,
                        isSelected && styles.addressCardSelected,
                      ]}
                      onPress={() => setSelectedAddress(item)}
                    >
                      <View style={styles.addressCardHeader}>
                        <Feather
                          name="map-pin"
                          size={16}
                          color={isSelected ? "#5C4033" : "#777"}
                        />
                        {isSelected && <Feather name="check-circle" size={16} color="#5C4033" />}
                      </View>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {item.rua}, {item.numero}
                      </Text>
                      <Text style={styles.addressSubtext} numberOfLines={1}>
                        {item.bairro} - {item.cidade}/{item.estado}
                      </Text>
                      <Text style={styles.addressCep}>CEP: {item.cep}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 2. Método de Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Forma de Pagamento</Text>
            
            <View style={styles.paymentSelector}>
              <TouchableOpacity
                style={[
                  styles.paymentTab,
                  paymentMethod === "PIX" && styles.paymentTabSelected,
                ]}
                onPress={() => setPaymentMethod("PIX")}
              >
                <Ionicons name="qr-code-outline" size={18} color={paymentMethod === "PIX" ? "#fff" : "#333"} />
                <Text style={[styles.paymentTabText, paymentMethod === "PIX" && styles.paymentTabTextSelected]}>
                  Pix
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentTab,
                  paymentMethod === "CREDIT_CARD" && styles.paymentTabSelected,
                ]}
                onPress={() => setPaymentMethod("CREDIT_CARD")}
              >
                <Feather name="credit-card" size={18} color={paymentMethod === "CREDIT_CARD" ? "#fff" : "#333"} />
                <Text style={[styles.paymentTabText, paymentMethod === "CREDIT_CARD" && styles.paymentTabTextSelected]}>
                  Cartão
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentTab,
                  paymentMethod === "BOLETO" && styles.paymentTabSelected,
                ]}
                onPress={() => setPaymentMethod("BOLETO")}
              >
                <Feather name="file-text" size={18} color={paymentMethod === "BOLETO" ? "#fff" : "#333"} />
                <Text style={[styles.paymentTabText, paymentMethod === "BOLETO" && styles.paymentTabTextSelected]}>
                  Boleto
                </Text>
              </TouchableOpacity>
            </View>

            {/* Payment Details Container */}
            <View style={styles.paymentDetails}>
              {paymentMethod === "PIX" && (
                <View style={styles.pixContainer}>
                  <Text style={styles.paymentInstruction}>
                    Escaneie o QR Code abaixo ou copie a chave Pix para finalizar a compra:
                  </Text>
                  <View style={styles.qrCodeContainer}>
                    <Image
                      source={require("../../assets/Utilitarios/pix_qr_code.png")}
                      style={styles.qrCodeImage}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.pixCopyBtn}
                    onPress={() =>
                      copyToClipboard(
                        "00020126360014br.gov.bcb.pix0114tagnstore@pix25300002",
                        "Código Pix copiado para a área de transferência!"
                      )
                    }
                  >
                    <Feather name="copy" size={16} color="#5C4033" style={{ marginRight: 8 }} />
                    <Text style={styles.pixCopyBtnText}>COPIAR CÓDIGO PIX</Text>
                  </TouchableOpacity>
                </View>
              )}

              {paymentMethod === "CREDIT_CARD" && (
                <View style={styles.cardForm}>
                  <Text style={styles.paymentInstruction}>Insira os dados do cartão de crédito:</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Número do Cartão"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    maxLength={16}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nome do Titular"
                    placeholderTextColor="#A0A0A0"
                    value={cardName}
                    onChangeText={setCardName}
                  />

                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 10 }]}
                      placeholder="MM/AA"
                      placeholderTextColor="#A0A0A0"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      maxLength={5}
                    />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="CVV"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="numeric"
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
              )}

              {paymentMethod === "BOLETO" && (
                <View style={styles.boletoContainer}>
                  <Text style={styles.paymentInstruction}>
                    O boleto será gerado após a confirmação. Copie o código de barras abaixo para pagar:
                  </Text>
                  <Text style={styles.barcodeText}>34191.79001 01043.513184 91020.150008 7 900000000000</Text>
                  <TouchableOpacity
                    style={styles.pixCopyBtn}
                    onPress={() =>
                      copyToClipboard(
                        "3419179001010435131849102015000879000000000000",
                        "Código de barras do boleto copiado!"
                      )
                    }
                  >
                    <Feather name="copy" size={16} color="#5C4033" style={{ marginRight: 8 }} />
                    <Text style={styles.pixCopyBtnText}>COPIAR CÓDIGO DE BARRAS</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* 3. Resumo do Pedido */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Resumo dos Itens</Text>
            {cartItems.map((item, idx) => (
              <View key={idx} style={styles.productRow}>
                <View style={styles.productImageContainer}>
                  <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productQtyPrice}>
                    Qtd: {item.quantity} • {item.price}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* 4. Totalizadores */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formattedTotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryValue, styles.totalPriceText]}>{formattedTotal}</Text>
            </View>
          </View>

          {/* Botão de Finalizar */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirmOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>FINALIZAR COMPRA</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  addAddressText: {
    fontSize: 14,
    color: "#5C4033",
    fontWeight: "bold",
  },
  noAddressContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  noAddressText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  btnRegisterAddress: {
    backgroundColor: "#5C4033",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnRegisterAddressText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressList: {
    paddingVertical: 5,
  },
  addressCard: {
    width: 220,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  addressCardSelected: {
    borderColor: "#5C4033",
    borderWidth: 2,
    backgroundColor: "#FDF9F6",
  },
  addressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  addressSubtext: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  addressCep: {
    fontSize: 11,
    color: "#999",
  },
  paymentSelector: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
  },
  paymentTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    gap: 6,
  },
  paymentTabSelected: {
    backgroundColor: "#5C4033",
  },
  paymentTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  paymentTabTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  paymentDetails: {
    paddingTop: 5,
  },
  paymentInstruction: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 15,
  },
  pixContainer: {
    alignItems: "center",
  },
  qrCodeContainer: {
    width: 160,
    height: 160,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
  },
  qrCodeImage: {
    width: "100%",
    height: "100%",
  },
  pixCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5C4033",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  pixCopyBtnText: {
    fontSize: 13,
    color: "#5C4033",
    fontWeight: "bold",
  },
  cardForm: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
  },
  boletoContainer: {
    alignItems: "center",
  },
  barcodeText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#333",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
    width: "100%",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4033",
  },
  confirmBtn: {
    backgroundColor: "#5C4033",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
