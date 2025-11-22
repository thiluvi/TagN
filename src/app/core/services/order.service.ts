import { Injectable, signal, inject, effect } from '@angular/core';
import { Order, CartItem } from '../types/types';
import { AuthService } from '../../auth/auth.service';

type AllOrdersStore = {
  [userId: string | number]: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private authService = inject(AuthService);
  private readonly storageKey = 'tagn-all-orders';

  // Lista de pedidos do usuário logado
  public orders = signal<Order[]>([]);

  constructor() {
    // Carrega os pedidos sempre que o serviço inicia ou o usuário muda
    effect(() => {
      this.loadOrdersFromStorage();
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Cria um novo pedido baseado nos itens do carrinho
  public createOrder(items: CartItem[], totalValue: number): void {
    const newOrder: Order = {
      id: '#' + Math.floor(Math.random() * 1000000).toString(), // Gera um ID aleatório
      date: new Date(),
      items: [...items], // Copia os itens para não manter referência
      total: totalValue,
      status: 'Processando'
    };

    this.orders.update(current => [newOrder, ...current]); // Adiciona no topo da lista
    this.saveOrdersToStorage();
  }

  // --- Persistência (LocalStorage) ---

  private loadOrdersFromStorage(): void {
    const currentUser = this.authService.currentUser();
    if (!this.isBrowser()) return;

    const storedData = localStorage.getItem(this.storageKey);
    const allOrders: AllOrdersStore = storedData ? JSON.parse(storedData) : {};

    if (currentUser) {
      this.orders.set(allOrders[currentUser.id] || []);
    } else {
      this.orders.set([]);
    }
  }

  private saveOrdersToStorage(): void {
    const currentUser = this.authService.currentUser();
    if (!this.isBrowser() || !currentUser) return;

    const storedData = localStorage.getItem(this.storageKey);
    const allOrders: AllOrdersStore = storedData ? JSON.parse(storedData) : {};
    
    allOrders[currentUser.id] = this.orders();
    localStorage.setItem(this.storageKey, JSON.stringify(allOrders));
  }
}