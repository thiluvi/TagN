import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Product, CartItem } from '../types/types';
import { AuthService } from '../../auth/auth.service';

type AllCartsStore = {
  [userId: string | number]: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private authService = inject(AuthService);
  private readonly storageKey = 'tagn-all-carts';

  // Signal principal do carrinho
  public cartItems = signal<CartItem[]>([]);

  // Computed: Calcula o subtotal
  public subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => {
      // Converte "103,50" para 103.50
      const priceNumber = parseFloat(item.product.price.replace('.', '').replace(',', '.'));
      return acc + (priceNumber * item.quantity);
    }, 0);
  });

  // Computed: Formata o subtotal de volta para string moeda "R$ 1.200,00"
  public subtotalFormatted = computed(() => {
    return this.subtotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });

  // Computed: Quantidade total de itens (para bolinha vermelha no ícone, se quiser usar depois)
  public totalItemsCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  constructor() {
    // Carrega/Salva automaticamente quando o usuário muda
    effect(() => {
      this.loadCartFromStorage();
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Adiciona produto ao carrinho
  public addToCart(product: Product, size: string | undefined, quantity: number): void {
    this.cartItems.update(items => {
      // Verifica se já existe esse produto com ESSE tamanho no carrinho
      const existingItemIndex = items.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Se existe, cria uma cópia do array e atualiza a quantidade
        const newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Se não existe, adiciona novo item
        return [...items, { product, selectedSize: size, quantity }];
      }
    });
    this.saveCartToStorage();
  }

  // Remove item do carrinho
  public removeFromCart(productId: string, size: string | undefined): void {
    this.cartItems.update(items => 
      items.filter(item => !(item.product.id === productId && item.selectedSize === size))
    );
    this.saveCartToStorage();
  }

  // Limpa o carrinho
  public clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  // --- Lógica de Persistência (Igual ao FavoritesService) ---

  private loadCartFromStorage(): void {
    const currentUser = this.authService.currentUser();
    
    if (!this.isBrowser()) return;

    const storedData = localStorage.getItem(this.storageKey);
    const allCarts: AllCartsStore = storedData ? JSON.parse(storedData) : {};

    if (currentUser) {
      this.cartItems.set(allCarts[currentUser.id] || []);
    } else {
      this.cartItems.set([]);
    }
  }

  private saveCartToStorage(): void {
    const currentUser = this.authService.currentUser();
    if (!this.isBrowser() || !currentUser) return;

    const storedData = localStorage.getItem(this.storageKey);
    const allCarts: AllCartsStore = storedData ? JSON.parse(storedData) : {};
    
    allCarts[currentUser.id] = this.cartItems();
    localStorage.setItem(this.storageKey, JSON.stringify(allCarts));
  }
}