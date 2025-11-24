import { Component, OnInit, signal, inject } from '@angular/core'; 
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../core/types/types';
import { ProductDataService } from '../product-data.service';
import { FavoritesService } from '../core/services/favorites.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  
  product = signal<Product | null>(null);
  
  selectedImageUrl = signal<string | undefined>(undefined); 
  selectedSize = signal<string | undefined>(undefined); 
  quantity = signal<number>(1); 

  // NOVO: Controle do modal de guia de medidas
  isSizeGuideOpen = signal(false);

  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private productDataService = inject(ProductDataService);
  public favoritesService = inject(FavoritesService); 

  ngOnInit(): void { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = params.get('productId'); 
      if (productId) { 
        this.productDataService.getProductById(productId).subscribe({
          next: (data) => {
            this.product.set(data);
            if (data.images && data.images.length > 0) { 
              this.selectedImageUrl.set(data.images[0]); 
            }
            if (data.sizes && data.sizes.length > 0) {
              this.selectedSize.set(data.sizes[0]);
            }
          },
          error: (err) => console.error('Erro ao carregar produto:', err)
        });
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl.set(imageUrl);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  adjustQuantity(delta: number): void {
    this.quantity.update(current => {
      const newVal = current + delta;
      return newVal > 0 ? newVal : 1;
    });
  }

  updateQuantityFromInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value > 0) {
      this.quantity.set(value);
    } else {
      this.quantity.set(1);
      input.value = '1'; 
    }
  }

  handleToggleFavorite(): void {
    const p = this.product();
    if (p) this.favoritesService.toggleFavorite(p);
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      const size = this.selectedSize();
      if (p.sizes && p.sizes.length > 0 && !size) {
        alert('Por favor, selecione um tamanho.');
        return;
      }
      this.cartService.addToCart(p, size, this.quantity());
      alert('Produto adicionado à sacola!');
    }
  }

  shareProduct(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => alert('Link copiado!')).catch(() => alert('Erro ao copiar.'));
  }

  openSizeTable(): void {
    this.isSizeGuideOpen.set(true);
  }

  closeSizeTable(): void {
    this.isSizeGuideOpen.set(false);
  }
}