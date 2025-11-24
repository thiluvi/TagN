import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from './core/types/types';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  // Busca todos os produtos da API
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Filtra por categoria (buscando tudo e filtrando, ou usando query params do json-server)
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }

  // Busca produto por ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Busca por nome
  searchProductsByName(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?name_like=${term}`);
  }

  // --- FUNCIONALIDADES DE ADMIN ---

  // Adicionar produto
  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Deletar produto
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}