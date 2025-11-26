import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Certifique-se de que o map está importado
import { Product } from './core/types/types';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // --- PESQUISA COM FILTRO DE ACENTOS E MAIÚSCULAS ---
  searchProductsByName(term: string): Observable<Product[]> {
    // Função auxiliar para remover acentos e transformar em minúsculo
    // Ex: "Anél" vira "anel", "SÃO PAULO" vira "sao paulo"
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedTerm = normalize(term.trim());

    return this.getAllProducts().pipe(
      map(products => {
        if (!normalizedTerm) return []; // Se a busca for vazia, retorna nada

        return products.filter(product => {
          // Normaliza o nome do produto para comparar
          const normalizedName = normalize(product.name);
          
          // Verifica se o nome contem o termo (agora ambos sem acento e minúsculos)
          return normalizedName.includes(normalizedTerm);
        });
      })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}