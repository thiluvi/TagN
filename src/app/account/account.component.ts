import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

// --- Importe os subcomponentes que criaremos a seguir ---
// import { OrdersComponent } from './orders/orders.component';
// import { ProfileDataComponent } from './profile-data/profile-data.component';
// import { AddressesComponent } from './addresses/addresses.component';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    // Adicione os subcomponentes aqui quando criados
    // OrdersComponent,
    // ProfileDataComponent,
    // AddressesComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  // Dados do usuário (substituir por dados reais do serviço de autenticação)
  userEmail = signal('emailDoUsuario@gmail.com');

  // Signal para controlar a view ativa
  activeView = signal<'pedidos' | 'dados' | 'enderecos'>('pedidos');

  // Métodos para mudar a view ativa
  showView(view: 'pedidos' | 'dados' | 'enderecos'): void {
    this.activeView.set(view);
  }

  // Método para logout (implementar a lógica real depois)
  logout(): void {
    console.log('Usuário deslogado!');
    // Adicionar lógica de logout e redirecionamento
    // Ex: this.authService.logout(); this.router.navigate(['/']);
  }
}