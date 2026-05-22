import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

export type Product = {
  id?: number;
  name: string;
  price: string;
  image: any;
  category: string;
  description: string;
};

export type CartItem = Product & {
  cartItemId?: number;
  quantity: number;
};

type ShopContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productName: string) => Promise<void>;
  updateQuantity: (productName: string, quantity: number) => Promise<void>;
  favoriteItems: Product[];
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productName: string) => boolean;
  refreshUserData: () => Promise<void>;
};

export const ShopContext = createContext<ShopContextType>({} as ShopContextType);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Estados Globais: Carrinho e Favoritos
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  /**
   * getUser - Recupera o usuário salvo no AsyncStorage.
   * Usado para obter o id do usuário para chamadas à API do backend.
   */
  const getUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@tagn_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Erro ao obter usuário do AsyncStorage:", e);
      return null;
    }
  };

  /**
   * loadCart - Busca a sacola/carrinho de compras do usuário direto do backend.
   * Converte o preço e formata os dados para o padrão do aplicativo.
   */
  const loadCart = async (userId: number) => {
    try {
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/sacola/usuario/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((item: any) => ({
          id: item.produto.id,
          cartItemId: item.id,
          name: item.produto.nome,
          price: `R$ ${Number(item.produto.preco).toFixed(2).replace(".", ",")}`,
          image: { uri: item.produto.imagem },
          category: item.produto.categoria,
          description: item.produto.descricao,
          quantity: item.quantidade,
        }));
        setCartItems(mapped);
      }
    } catch (error) {
      console.error("Erro ao carregar sacola do backend:", error);
    }
  };

  /**
   * loadFavorites - Busca a lista de produtos favoritos do usuário no backend.
   */
  const loadFavorites = async (userId: number) => {
    try {
      const URL_BACKEND = "http://localhost:8080";
      const response = await fetch(`${URL_BACKEND}/favoritos/usuario/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((fav: any) => ({
          id: fav.produto.id,
          favoriteId: fav.id,
          name: fav.produto.nome,
          price: `R$ ${Number(fav.produto.preco).toFixed(2).replace(".", ",")}`,
          image: { uri: fav.produto.imagem },
          category: fav.produto.categoria,
          description: fav.produto.descricao,
        }));
        setFavoriteItems(mapped);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos do backend:", error);
    }
  };

  /**
   * refreshUserData - Atualiza os dados do usuário ativo no contexto.
   * Recarrega a sacola e favoritos se logado; caso contrário, limpa as listas.
   */
  const refreshUserData = async () => {
    const user = await getUser();
    if (user && user.id) {
      await Promise.all([loadCart(user.id), loadFavorites(user.id)]);
    } else {
      setCartItems([]);
      setFavoriteItems([]);
    }
  };

  // Carrega os dados na montagem do contexto
  useEffect(() => {
    refreshUserData();
  }, []);

  /**
   * addToCart - Adiciona um produto ao carrinho.
   * Se o produto já existir no carrinho, incrementa a quantidade fazendo uma chamada PUT.
   * Caso contrário, faz uma chamada POST para criar o item de sacola no backend.
   */
  const addToCart = async (product: Product, quantity: number) => {
    const user = await getUser();
    if (!user) {
      Alert.alert("Atenção", "Por favor, faça login para adicionar produtos à sacola.");
      return;
    }

    try {
      const URL_BACKEND = "http://localhost:8080";
      const existingItem = cartItems.find((item) => item.name === product.name);

      if (existingItem && existingItem.cartItemId) {
        const newQty = existingItem.quantity + quantity;
        const response = await fetch(`${URL_BACKEND}/sacola/${existingItem.cartItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantidade: newQty }),
        });
        if (response.ok) {
          await loadCart(user.id);
        } else {
          Alert.alert("Erro", "Não foi possível atualizar a quantidade do produto.");
        }
      } else {
        const response = await fetch(`${URL_BACKEND}/sacola`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: { id: user.id },
            produto: { id: product.id },
            quantidade: quantity,
          }),
        });
        if (response.ok) {
          await loadCart(user.id);
        } else {
          Alert.alert("Erro", "Não foi possível adicionar o produto à sacola.");
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar à sacola:", error);
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    }
  };

  /**
   * removeFromCart - Remove um produto do carrinho no backend por meio do ID do item.
   */
  const removeFromCart = async (productName: string) => {
    const user = await getUser();
    if (!user) return;

    const itemToDelete = cartItems.find((item) => item.name === productName);
    if (itemToDelete && itemToDelete.cartItemId) {
      try {
        const URL_BACKEND = "http://localhost:8080";
        const response = await fetch(`${URL_BACKEND}/sacola/${itemToDelete.cartItemId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await loadCart(user.id);
        }
      } catch (error) {
        console.error("Erro ao remover da sacola:", error);
      }
    }
  };

  /**
   * updateQuantity - Atualiza a quantidade de um produto específico no carrinho.
   */
  const updateQuantity = async (productName: string, quantity: number) => {
    if (quantity < 1) return;
    const user = await getUser();
    if (!user) return;

    const itemToUpdate = cartItems.find((item) => item.name === productName);
    if (itemToUpdate && itemToUpdate.cartItemId) {
      try {
        const URL_BACKEND = "http://localhost:8080";
        const response = await fetch(`${URL_BACKEND}/sacola/${itemToUpdate.cartItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantidade: quantity }),
        });
        if (response.ok) {
          await loadCart(user.id);
        }
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
      }
    }
  };

  /**
   * toggleFavorite - Adiciona ou remove o produto da lista de favoritos do backend.
   */
  const toggleFavorite = async (product: Product) => {
    const user = await getUser();
    if (!user) {
      Alert.alert("Atenção", "Por favor, faça login para favoritar produtos.");
      return;
    }

    const URL_BACKEND = "http://localhost:8080";
    const existingFav = favoriteItems.find((item: any) => item.name === product.name) as any;

    try {
      if (existingFav && existingFav.favoriteId) {
        const response = await fetch(`${URL_BACKEND}/favoritos/${existingFav.favoriteId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await loadFavorites(user.id);
        }
      } else {
        const response = await fetch(`${URL_BACKEND}/favoritos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: { id: user.id },
            produto: { id: product.id },
          }),
        });
        if (response.ok) {
          await loadFavorites(user.id);
        }
      }
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar:", error);
    }
  };

  /**
   * isFavorite - Helper síncrono para verificar rapidamente no estado se um produto é favorito.
   */
  const isFavorite = (productName: string) => {
    return favoriteItems.some((item) => item.name === productName);
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        favoriteItems,
        toggleFavorite,
        isFavorite,
        refreshUserData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// Hook customizado para consumir os estados do ShopContext de forma simplificada
export const useShop = () => useContext(ShopContext);
