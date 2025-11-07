import { Injectable, signal, computed } from '@angular/core'; // Adicione 'computed'

// (Opcional) Interface para clareza
export interface AppUser {
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Trocamos o booleano por um signal que guarda o usuário (ou null)
  private currentUser = signal<AppUser | null>(null);

  // Criamos um 'computed' signal para saber se está autenticado
  public isAuthenticated = computed(() => this.currentUser() !== null);
  
  // Sinal para saber a role atual
  public currentUserRole = computed(() => this.currentUser()?.role ?? null);

  constructor() { }

  // Modificamos o login para retornar a 'role' ou 'null'
  login(email: string, password: string): 'admin' | 'user' | null {
    
    // SIMULAÇÃO DE BANCO DE DADOS (JsonServer virá aqui)
    const mockUserDb: AppUser[] = [
      { email: 'admin@senac.com', role: 'admin' },
      { email: 'user@senac.com', role: 'user' }
    ];

    // Simulação de login de admin (requisito do projeto)
    if (email === 'admin@senac.com' && password === '1234') {
      const adminUser = mockUserDb[0];
      this.currentUser.set(adminUser);
      console.log('Login como ADMIN bem-sucedido!');
      return adminUser.role;
    }

    // Simulação de login de usuário comum
    if (email === 'user@senac.com' && password === '1234') {
      const commonUser = mockUserDb[1];
      this.currentUser.set(commonUser);
      console.log('Login como USER bem-sucedido!');
      return commonUser.role;
    }
    
    console.log('Falha no login');
    this.currentUser.set(null);
    return null;
  }

  logout(): void {
    this.currentUser.set(null);
    // (Opcional) Redirecionar para o login
    // const router = inject(Router); // precisaria injetar no construtor
    // router.navigate(['/']);
  }
}