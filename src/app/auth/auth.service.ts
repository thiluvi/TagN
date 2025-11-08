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

  // 1. Renomeie o signal para ser privado (convenção com _)
  private _currentUser = signal<AppUser | null>(null);

  // 2. Sinais computados públicos
  public isAuthenticated = computed(() => this._currentUser() !== null);
  public currentUserRole = computed(() => this._currentUser()?.role ?? null);
  
  // 3. CRIE ESTE SINAL PÚBLICO para os outros componentes lerem
  public currentUser = computed(() => this._currentUser());


  constructor() { }

  login(email: string, password: string): Observable<AppUser | null> {
    return this.http.get<AppUser[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        const user = users[0];
        if (user) {
          // 4. Use o signal privado para definir o valor
          this._currentUser.set(user); 
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

  logout(): void {
    // 5. Use o signal privado para definir o valor
    this._currentUser.set(null); 
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