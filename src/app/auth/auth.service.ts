import { Injectable, signal, computed, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 
import { map, catchError, tap } from 'rxjs/operators'; 
import { AppUser } from '../core/types/types'; // Isto está correto

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';
  
  // NOVO: Chave para o localStorage
  private readonly storageKey = 'tagn-user';

  private _currentUser = signal<AppUser | null>(null);

  public isAuthenticated = computed(() => this._currentUser() !== null);
  public currentUserRole = computed(() => this._currentUser()?.role ?? null);
  public currentUser = computed(() => this._currentUser());


  constructor() {
    // NOVO: Carregar o usuário do localStorage ao iniciar
    this.loadUserFromStorage();
  }

  // NOVO: Função auxiliar para verificar se está no navegador (importante para SSR)
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // NOVO: Função que carrega o usuário do localStorage
  private loadUserFromStorage(): void {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem(this.storageKey);
      if (storedUser) {
        this._currentUser.set(JSON.parse(storedUser));
      }
    }
  }

  // ATUALIZADO: Método de login
  login(email: string, password: string): Observable<AppUser | null> {
    return this.http.get<AppUser[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        const user = users[0];
        if (user) {
          this._currentUser.set(user);
          
          // NOVO: Salvar no localStorage
          if (this.isBrowser()) {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
          }
          
          return user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Erro no login:', error);
        return of(null);
      })
    );
  }

  // ATUALIZADO: Método de logout
  logout(): void {
    this._currentUser.set(null);
    
    // NOVO: Remover do localStorage
    if (this.isBrowser()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  
  // ... (O restante dos métodos CRUD (loadUsers, registerUser, etc) está correto) ...
  loadUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  registerUser(user: Omit<AppUser, 'id'>): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user);
  }

  deleteUser(userId: number): Observable<{}> { 
    return this.http.delete<{}>(`${this.apiUrl}/${userId}`);
  }

  updatePassword(userId: number, newPassword: string): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.apiUrl}/${userId}`, { password: newPassword });
  }
}