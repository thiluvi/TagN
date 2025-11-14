import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // +++ IMPORTE AQUI +++
import { FavoritesService } from '../core/services/favorites.service';
import { Product } from '../core/types/types';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // +++ ADICIONE AQUI +++
  ],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.css']
})
export class OverlayComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() contentType = '';
  @Output() close = new EventEmitter<void>();

  private favoritesService = inject(FavoritesService);

  public favoriteItems = this.favoritesService.favorites;

  public handleRemoveFavorite(event: MouseEvent, productId: string): void {
    event.stopPropagation(); 
    this.favoritesService.removeFavorite(productId);
  }
  
  onClose(): void {
    this.close.emit();
  }
}