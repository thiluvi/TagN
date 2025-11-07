// Adicione 'signal' aqui também
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);

  constructor() { }

  login(email: string, password: string): boolean {
    // SIMULAÇÃO:
    if (email === 'admin@senac.com' && password === '1234') {
      this.isAuthenticated.set(true);
      console.log('Login bem-sucedido!');
      return true;
    }
    
    console.log('Falha no login');
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}