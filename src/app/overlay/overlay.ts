import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../core/services/favorites.service';
import { CartService } from '../core/services/cart.service'; // 1. Importe

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
  public cartService = inject(CartService); // 2. Injete público para usar no HTML

  public favoriteItems = this.favoritesService.favorites;
  // Usamos cartService.cartItems() e cartService.subtotalFormatted() diretamente no HTML

  public handleRemoveFavorite(event: MouseEvent, productId: string): void {
    event.stopPropagation(); 
    this.favoritesService.removeFavorite(productId);
  }

  // 3. Remover item do carrinho
  public handleRemoveFromCart(event: MouseEvent, productId: string, size: string | undefined): void {
    event.stopPropagation();
    this.cartService.removeFromCart(productId, size);
  }

  // 4. SURPRESA: Finalizar compra via WhatsApp
  public finalizePurchase(): void {
    const items = this.cartService.cartItems();
    if (items.length === 0) return;

    let message = "Olá! Gostaria de finalizar meu pedido no site TagN:\n\n";
    
    items.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.product.name}`;
      if (item.selectedSize) {
        message += ` (Tam: ${item.selectedSize})`;
      }
      message += ` - R$ ${item.product.price}\n`;
    });

    message += `\n*Total: ${this.cartService.subtotalFormatted()}*`;
    message += `\n\nAguardo instruções para pagamento.`;

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Substitua pelo número real da loja (55 + DDD + Numero)
    const whatsappNumber = "5511999999999"; 
    
    // Abre o WhatsApp em nova aba
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  }
  
  onClose(): void {
    this.close.emit();
  }
}