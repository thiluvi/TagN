import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../types/types'; 

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/addresses';

  getAddressesByUserId(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addAddress(addressData: Omit<Address, 'id'>): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, addressData);
  }

  // --- NOVO MÉTODO (ALTERAR) ---
  // O json-server usa PUT para substituir o objeto inteiro.
  updateAddress(addressId: number, addressData: Omit<Address, 'id' | 'userId'>): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${addressId}`, addressData);
  }

  // --- NOVO MÉTODO (EXCLUIR) ---
  deleteAddress(addressId: number): Observable<{}> {
    return this.http.delete<{}>(`${this.apiUrl}/${addressId}`);
  }
}