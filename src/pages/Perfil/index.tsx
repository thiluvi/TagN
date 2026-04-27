import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export function Perfil({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@tagn_user");
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfoSection}>
        <Feather
          name="user"
          size={80}
          color="#000"
          style={styles.profileIcon}
        />
        <Text style={styles.greetingText}>
          Olá, {userData ? userData.nome : "(nome do usuário)"}
        </Text>
      </View>

      {/* Main Content Area (Gray background) */}
      <View style={styles.contentArea}>
        <View style={styles.menuList}>
          {/* Menu Item 1 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="clipboard" size={24} color="#000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Meus pedidos</Text>
              <Text style={styles.menuSubtitle}>Ver histórico de compras</Text>
            </View>
          </TouchableOpacity>

          {/* Menu Item 2 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="map-pin" size={24} color="#000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Meu endereços</Text>
              <Text style={styles.menuSubtitle}>Gerenciar endereços</Text>
            </View>
          </TouchableOpacity>

          {/* Menu Item 3 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Feather name="file-text" size={24} color="#000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Informações da conta</Text>
              <Text style={styles.menuSubtitle}>Gerenciar senha, nome</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconWrapper}>
            <Feather
              name="log-out"
              size={24}
              color="#000"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </View>
          <Text style={styles.logoutText}>Sair</Text>
          <View style={styles.logoutIconSpacer} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileIcon: {
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 18,
    color: "#333",
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  menuList: {
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },
  menuIconContainer: {
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
    backgroundColor: "transparent",
  },
  logoutIconWrapper: {
    width: 24,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  logoutIconSpacer: {
    width: 24,
  },
});
