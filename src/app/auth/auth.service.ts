import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 1. Importe o HttpClient
import { Observable, of } from 'rxjs'; // 2. Importe Observable e 'of' (para o logout)
import { map, catchError, tap } from 'rxjs/operators'; // 3. Importe operadores RxJS

// Você pode mover esta interface para um arquivo types.ts, como no PDF [cite: 154]
export interface AppUser {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: 'admin' | 'user';
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Injeta o HttpClient
  private http = inject(HttpClient); 
  // URL da nossa API simulada [cite: 292]
  private apiUrl = 'http://localhost:3000/users'; 

  private currentUser = signal<AppUser | null>(null);
  public isAuthenticated = computed(() => this.currentUser() !== null);
  public currentUserRole = computed(() => this.currentUser()?.role ?? null);

  constructor() { }

  // 4. O LOGIN AGORA É ASSÍNCRONO (retorna um Observable)
  login(email: string, password: string): Observable<AppUser | null> {
    
    // O json-server permite filtrar com query params
    // Vamos buscar por email E senha.
    // NOTA DE SEGURANÇA: Isso NUNCA deve ser feito em produção (enviar senha na URL).
    // Mas para o json-server, é como simulamos o login.
    return this.http.get<AppUser[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        const user = users[0]; // Se a API retornar um array, pegamos o primeiro
        if (user) {
          this.currentUser.set(user); // Define o usuário logado
          return user;
        }
        return null; // Login falhou
      }),
      catchError(error => {
        console.error('Erro no login:', error);
        return of(null); // Retorna um observable de nulo em caso de erro
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    // NOTA: O Angular não vai redirecionar automaticamente
    // O ideal é o componente que chama o logout fazer o redirecionamento
  }

  // --- MÉTODOS DE ADMIN (CRUD) ---

  // READ (Listar) [cite: 295-297]
  loadUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  // CREATE (Cadastrar) [cite: 426-428]
  registerUser(user: Omit<AppUser, 'id'>): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user);
  }

  // DELETE (Excluir) [cite: 471-472]
  deleteUser(userId: number): Observable<{}> { // Retorna um objeto vazio
    return this.http.delete<{}>(`${this.apiUrl}/${userId}`);
  }

  // UPDATE (Alterar Senha - usando PATCH)
  updatePassword(userId: number, newPassword: string): Observable<AppUser> {
    // Usamos PATCH para atualizar apenas o campo de senha
    return this.http.patch<AppUser>(`${this.apiUrl}/${userId}`, { password: newPassword });
  }
}