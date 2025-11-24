import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { ProductDataService } from '../product-data.service';

// IMPORTANTE: Importe a interface centralizada para manter consistência
import { Product } from '../core/types/types'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // O RouterModule está aqui, isso faz o clique funcionar!
  templateUrl: './product-list.component.html',
  styleUrls: [
      '../popular-products/popular-products.component.css', 
      './product-list.component.css'
  ]
})
export class ProductListComponent implements OnInit {
  categoryName = signal<string>('');
  products = signal<Product[]>([]);

  constructor(
    private route: ActivatedRoute, 
    private productDataService: ProductDataService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const category = params.get('categoryName');
      
      if (category) {
        // Formata o nome para exibição (Ex: "Correntes")
        let formattedName = category.charAt(0).toUpperCase() + category.slice(1);
        formattedName = formattedName.replace(/-/g, ' ');
        this.categoryName.set(formattedName);
        
        // Busca os produtos
        this.productDataService.getProductsByCategory(category).subscribe({
          next: (data) => {
            this.products.set(data);
            console.log('Produtos carregados:', data); // Ajuda a debugar se vier vazio
          },
          error: (err) => console.error('Erro ao buscar produtos', err)
        });
        
      } else {
         this.products.set([]);
         this.categoryName.set('Categoria não encontrada');
      }
    });
  }
}