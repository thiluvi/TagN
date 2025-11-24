import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductDataService } from '../product-data.service';
import { Product } from '../core/types/types'; // Importando do local correto
import { switchMap } from 'rxjs/operators';

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

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('q') || '';
        this.searchTerm.set(query);
        
        // CORREÇÃO: Retornar o Observable diretamente, sem colchetes []
        return this.productDataService.searchProductsByName(query);
      })
    ).subscribe({
      next: (filteredProducts) => {
        // Agora filteredProducts é do tipo Product[] corretamente
        this.products.set(filteredProducts);
      },
      error: (err) => console.error('Erro na busca:', err)
    });
  }
}