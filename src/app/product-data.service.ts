import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  searchProductsByName(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?name_like=${term}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // --- NOVO MÉTODO PARA EDITAR ---
  updateProduct(product: Product): Observable<Product> {
    // O json-server aceita PUT para atualizar o objeto inteiro pelo ID
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}