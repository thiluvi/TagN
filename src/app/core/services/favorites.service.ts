import { Injectable, signal, computed, inject, effect } from '@angular/core'; // 1. Importe 'inject' e 'effect'
import { Product } from '../types/types';
import { AuthService } from '../../auth/auth.service'; // 2. Importe o AuthService

/**
 * Define a estrutura do nosso objeto no localStorage.
 * Será um mapa, onde a chave é o ID do usuário.
 * Ex: { "1": [produto1], "5acb": [produto2, produto3] }
 */
type AllFavoritesStore = {
  [userId: string | number]: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // 3. Injete o AuthService
  private authService = inject(AuthService);

  // 4. Mude a chave para refletir que armazena TUDO
  private readonly storageKey = 'tagn-all-favorites';
  
  // Este signal SEMPRE conterá a lista APENAS do usuário logado
  public favorites = signal<Product[]>([]);

  // Este 'computed' não precisa mudar, ele já funciona com o signal 'favorites'
  public isFavorite = computed(() => {
    const favoriteIds = this.favorites().map(p => p.id);
    return (productId: string) => favoriteIds.includes(productId);
  });

  constructor() {
    // 5. O 'effect' é a mágica aqui.
    // Ele roda uma vez quando o serviço é criado...
    // ...e roda DE NOVO toda vez que o 'currentUser' do authService MUDAR.
    effect(() => {
      // Se o usuário mudou (login/logout), recarregamos a lista de favoritos
      this.loadFavoritesFromStorage();
    });
  }

  // --- Funções Auxiliares de Storage ---
  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // 6. MÉTODO ATUALIZADO
  private loadFavoritesFromStorage(): void {
    const currentUser = this.authService.currentUser(); // Pega o usuário logado
    
    if (!this.isBrowser()) {
      this.favorites.set([]);
      return;
    }

    const storedData = localStorage.getItem(this.storageKey);
    const allFavorites: AllFavoritesStore = storedData ? JSON.parse(storedData) : {};

    if (currentUser) {
      // Se TEM um usuário, pegamos a lista dele (ou uma lista vazia, se for o primeiro acesso)
      const userFavorites = allFavorites[currentUser.id] || [];
      this.favorites.set(userFavorites);
    } else {
      // Se NÃO TEM usuário (logout), limpamos a lista
      this.favorites.set([]);
    }
  }

  // 7. MÉTODO ATUALIZADO
  private saveFavoritesToStorage(): void {
    const currentUser = this.authService.currentUser();

    // Se não está no browser ou não tem usuário logado, não faz nada
    if (!this.isBrowser() || !currentUser) {
      return;
    }

    // Pega o "mapa" completo do storage
    const storedData = localStorage.getItem(this.storageKey);
    const allFavorites: AllFavoritesStore = storedData ? JSON.parse(storedData) : {};
    
    // Atualiza APENAS a entrada (chave) do usuário atual com a lista do signal
    allFavorites[currentUser.id] = this.favorites();
    
    // Salva o "mapa" completo de volta no storage
    localStorage.setItem(this.storageKey, JSON.stringify(allFavorites));
  }

  // --- Métodos Públicos (NÃO MUDAM) ---
  // A lógica deles já funciona, pois eles só manipulam o signal 'favorites'.
  // O 'saveFavoritesToStorage' fará o resto.

  /** Adiciona ou remove um produto da lista de favoritos do usuário logado */
  public toggleFavorite(product: Product): void {
    if (this.isFavorite()(product.id)) {
      this.favorites.update(current => current.filter(p => p.id !== product.id));
    } else {
      this.favorites.update(current => [...current, product]);
    }
    this.saveFavoritesToStorage(); // Salva a lista atualizada para o usuário logado
  }

  /** Remove explicitamente um produto do usuário logado */
  public removeFavorite(productId: string): void {
    this.favorites.update(current => current.filter(p => p.id !== productId));
    this.saveFavoritesToStorage(); // Salva a lista atualizada para o usuário logado
  }
}