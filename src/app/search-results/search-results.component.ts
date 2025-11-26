import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductDataService } from '../product-data.service';
import { Product } from '../core/types/types';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // Importante para tratar casos vazios

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './search-results.component.html',
  styleUrls: [
    '../popular-products/popular-products.component.css',
    '../product-list/product-list.component.css',
    './search-results.component.css'
  ]
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productDataService = inject(ProductDataService);

  products = signal<Product[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false); // Adicionei um estado de carregamento opcional

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('q') || '';
        this.searchTerm.set(query);
        
        // Se a busca estiver vazia, não chama o serviço e retorna array vazio
        if (!query.trim()) {
          return of([]); 
        }

        this.isLoading.set(true);
        return this.productDataService.searchProductsByName(query);
      })
    ).subscribe({
      next: (filteredProducts) => {
        this.products.set(filteredProducts);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro na busca:', err);
        this.products.set([]);
        this.isLoading.set(false);
      }
    });
  }
}