import { Component, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importe o CommonModule para usar *ngIf

// Importe seus serviços
import { CartService } from '../core/services/cart.service';
import { FavoritesService } from '../core/services/favorites.service';

@Component({
  selector: 'app-topbar',
  standalone: true, 
  imports: [RouterModule, FormsModule, CommonModule], // Adicione CommonModule
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  private router = inject(Router);
  
  // Injete os serviços como públicos para usar no HTML
  public cartService = inject(CartService);
  public favoritesService = inject(FavoritesService);

  @Output() openOverlay = new EventEmitter<string>();

  public searchTerm = signal<string>('');

  // Computed para contar favoritos (o carrinho já tem um computed pronto no serviço)
  public favoritesCount = computed(() => this.favoritesService.favorites().length);

  onFavoritesClick(): void {
    this.openOverlay.emit('Favoritos');
  }

  onCartClick(): void {
    this.openOverlay.emit('Sacola');
  }

  onProfileClick(): void {
    this.router.navigate(['/conta']); 
  }

  onSearchSubmit(): void {
    const term = this.searchTerm();
    if (term && term.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { q: term } });
      this.searchTerm.set(''); 
    }
  }
}