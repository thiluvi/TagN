import { Component, OnInit, signal, inject } from '@angular/core'; 
import { ActivatedRoute, ParamMap, Router } from '@angular/router'; // Adicionei Router caso precise redirecionar
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
  
  // MUDANÇA 1: Transformar product em Signal para garantir a atualização da tela
  product = signal<Product | null>(null);
  
  // Signals para estado local
  selectedImageUrl = signal<string | undefined>(undefined); 
  selectedSize = signal<string | undefined>(undefined); 
  quantity = signal<number>(1); 

  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private productDataService = inject(ProductDataService);
  public favoritesService = inject(FavoritesService); 

  ngOnInit(): void { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = params.get('productId'); 
      
      console.log('ID capturado na URL:', productId); // DEBUG 1

      if (productId) { 
        this.productDataService.getProductById(productId).subscribe({
          next: (data) => {
            console.log('Dados recebidos da API:', data); // DEBUG 2

            // MUDANÇA 2: Atualizando o Signal
            this.product.set(data);
            
            // Define a imagem inicial
            if (data.images && data.images.length > 0) { 
              this.selectedImageUrl.set(data.images[0]); 
            }

            // Define o tamanho inicial
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
    this.quantity.update(currentQuantity => {
      const newQuantity = currentQuantity + delta;
      return newQuantity > 0 ? newQuantity : 1;
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
    const currentProduct = this.product(); // Acessando o valor do signal
    if (currentProduct) {
      this.favoritesService.toggleFavorite(currentProduct);
    }
  }

  addToCart(): void {
    const currentProduct = this.product(); // Acessando o valor do signal
    
    if (currentProduct) {
      const size = this.selectedSize();
      
      if (currentProduct.sizes && currentProduct.sizes.length > 0 && !size) {
        alert('Por favor, selecione um tamanho.');
        return;
      }

      this.cartService.addToCart(currentProduct, size, this.quantity());
      alert('Produto adicionado à sacola!');
    }
  }

  shareProduct(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      alert('Erro ao copiar o link.');
    });
  }
}