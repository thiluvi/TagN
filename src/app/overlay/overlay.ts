import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Adicione Router
import { FavoritesService } from '../core/services/favorites.service';
import { CartService } from '../core/services/cart.service';
import { OrderService } from '../core/services/order.service'; // 1. Importe OrderService

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.css']
})
export class OverlayComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() contentType = '';
  @Output() close = new EventEmitter<void>();

  private favoritesService = inject(FavoritesService);
  public cartService = inject(CartService);
  private orderService = inject(OrderService); // 2. Injete o OrderService
  private router = inject(Router); // 3. Injete o Router para redirecionar

  public favoriteItems = this.favoritesService.favorites;

  public handleRemoveFavorite(event: MouseEvent, productId: string): void {
    event.stopPropagation(); 
    this.favoritesService.removeFavorite(productId);
  }

  public handleRemoveFromCart(event: MouseEvent, productId: string, size: string | undefined): void {
    event.stopPropagation();
    this.cartService.removeFromCart(productId, size);
  }

  // 4. NOVA LÓGICA DE FINALIZAR COMPRA
  public finalizePurchase(): void {
    const items = this.cartService.cartItems();
    const total = this.cartService.subtotal();

    if (items.length === 0) return;

    // 1. Cria o pedido no histórico
    this.orderService.createOrder(items, total);

    // 2. Limpa o carrinho
    this.cartService.clearCart();

    // 3. Fecha o overlay
    this.onClose();

    // 4. Feedback e Redirecionamento
    alert('Compra finalizada com sucesso! Você pode acompanhar em "Meus Pedidos".');
    
    // Opcional: Levar o usuário direto para a tela de pedidos
    this.router.navigate(['/conta']); 
  }
  
  onClose(): void {
    this.close.emit();
  }
}