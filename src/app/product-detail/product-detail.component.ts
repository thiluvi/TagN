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
  imports: [CommonModule], // Adicione CommonModule aqui
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {
  product: Product | undefined; // Propriedade para guardar os dados do produto
  // Use signal para o URL da imagem selecionada para melhor deteção de alterações (opcional mas recomendado)
  selectedImageUrl = signal<string | undefined>(undefined); 

  // ------------------------------------------------------------------------------------------------------
  selectedSize = signal<string | undefined>(undefined); // Para armazenar o tamanho selecionado
  quantity = signal<number>(1); // Para armazenar a quantidade (inicia em 1)
  // ------------------------------------------------------------------------------------------------------

  private cartService = inject(CartService);


  private route = inject(ActivatedRoute);
  private productDataService = inject(ProductDataService); // Usado para buscar o produto
  public favoritesService = inject(FavoritesService); 

  ngOnInit(): void { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = params.get('productId'); 
      if (productId) { 
        // +++ BUSQUE O PRODUTO DO SERVIÇO +++
        this.product = this.productDataService.getProductById(productId); 
        
        if (this.product && this.product.images.length > 0) { 
          this.selectedImageUrl.set(this.product.images[0]); 
        }

        // +++ INICIALIZE O TAMANHO SELECIONADO +++
        if (this.product && this.product.sizes && this.product.sizes.length > 0) {
          this.selectedSize.set(this.product.sizes[0]);
        }
      }
    });
  }

  // Método para mudar a imagem selecionada
  selectImage(imageUrl: string): void { //
    this.selectedImageUrl.set(imageUrl); // Use .set() para signals //
  }

  // -------------------------------------------------------------------------------------------------------
  // NOVO MÉTODO para selecionar o tamanho
  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  // NOVO MÉTODO para ajustar a quantidade
  adjustQuantity(delta: number): void {
    this.quantity.update(currentQuantity => {
      // Garante que a quantidade nunca seja menor que 1
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
      // Se o usuário apagar tudo ou digitar 0, volta para 1
      this.quantity.set(1);
      input.value = '1'; 
    }
  }

  // +++ ADICIONE O MÉTODO PARA FAVORITAR +++
  handleToggleFavorite(): void {
    if (this.product) {
      this.favoritesService.toggleFavorite(this.product);
    }
  }

  addToCart(): void {
    if (this.product) {
      const size = this.selectedSize();
      
      // Validação: Se o produto tem tamanhos, o usuário PRECISA escolher um
      if (this.product.sizes && this.product.sizes.length > 0 && !size) {
        alert('Por favor, selecione um tamanho.');
        return;
      }

      this.cartService.addToCart(this.product, size, this.quantity());
      
      // Feedback visual simples (opcional) ou abrir o overlay automaticamente
      // Vamos fazer um alerta simples por enquanto ou você pode emitir um evento para abrir o overlay
      alert('Produto adicionado à sacola!');
    }
  }

  shareProduct(): void {
    // Pega a URL completa do navegador
    const url = window.location.href;

    // Usa a API do navegador para copiar o texto
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      alert('Erro ao copiar o link.');
    });
  }

}