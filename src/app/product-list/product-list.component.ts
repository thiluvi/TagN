import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router'; // Adicionado ParamMap e RouterModule
import { ProductDataService } from '../product-data.service'; // Importar o novo serviço

// (Copie a interface Product do serviço para este arquivo, se quiser manter a tipagem forte)
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  sizes?: string[];
  category: string; 
}


@Component({
  selector: 'app-product-list',
  standalone: true,
  // Adicione RouterModule para que o [routerLink] do template funcione
  imports: [CommonModule, RouterModule], 
  templateUrl: './product-list.component.html', // Usaremos um arquivo HTML separado (próximo passo)
  // Reutilize o CSS do PopularProductsComponent para o estilo do card
  styleUrls: [
      '../popular-products/popular-products.component.css', 
      './product-list.component.css' // O NOVO CSS com o grid
  ]
})
export class ProductListComponent implements OnInit {
  categoryName = signal<string>('');
  // NOVA PROPRIEDADE: Lista de produtos para a categoria
  products = signal<Product[]>([]);

  // Injetar ActivatedRoute e ProductDataService
  constructor(
    private route: ActivatedRoute, 
    private productDataService: ProductDataService // Injeção
  ) { }

  ngOnInit(): void {
    // Escuta as mudanças no parâmetro da rota
    this.route.paramMap.subscribe((params: ParamMap) => {
      const category = params.get('categoryName');
      
      if (category) {
        // 1. Formata o nome da categoria para exibição
        let formattedName = category.charAt(0).toUpperCase() + category.slice(1);
        formattedName = formattedName.replace(/-/g, ' ');
        this.categoryName.set(formattedName);
        
        // 2. Busca e define os produtos filtrados usando o serviço
        const filteredProducts = this.productDataService.getProductsByCategory(category);
        this.products.set(filteredProducts as Product[]); // Define a lista de produtos
      } else {
         this.products.set([]);
         this.categoryName.set('Categoria não encontrada');
      }
    });
  }
  
  // Opcional: Remova os métodos scroll, pois essa página não será um carrossel.
  // Se quiser manter o layout de carrossel fixo, mantenha os métodos e o ViewChild.
}