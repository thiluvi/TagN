import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Importe RouterModule
import { ProductDataService } from '../product-data.service';
import { switchMap } from 'rxjs/operators';

// Copie a interface Product do seu serviço para cá
interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
  category: string; 
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './search-results.component.html',
  
  // --- CORRIJA ESTA LINHA ---
  // Adicione o 'popular-products.component.css' 
  // para que ele tenha os estilos base do card.
  styleUrls: [
    '../popular-products/popular-products.component.css', // 1. ADICIONE ESTA LINHA
    '../product-list/product-list.component.css',        // 2. MANTENHA ESTA LINHA
    './search-results.component.css'                     // 3. MANTENHA ESTA LINHA
  ]
  // --- FIM DA CORREÇÃO ---
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productDataService = inject(ProductDataService);

  products = signal<Product[]>([]);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    // Escuta mudanças nos parâmetros da URL (ex: ?q=...)
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('q') || '';
        this.searchTerm.set(query);
        // Retorna os produtos encontrados pelo serviço
        return [this.productDataService.searchProductsByName(query)];
      })
    ).subscribe(filteredProducts => {
      this.products.set(filteredProducts as Product[]);
    });
  }
}