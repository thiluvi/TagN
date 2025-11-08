// 1. Adicione 'computed' à esta linha de importação
import { Component, signal, inject, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../auth/auth.service'; 
import { Router } from '@angular/router'; 

import { ProfileDataComponent } from './profile-data/profile-data.component';
import { AddressListComponent } from './address-list/address-list.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ProfileDataComponent,
    AddressListComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Esta linha agora funcionará, pois 'computed' foi importado
  //    e 'authService.currentUser' agora é público (da Correção 2)
  userEmail = computed(() => this.authService.currentUser()?.email ?? 'email@...com');

  activeView = signal<'pedidos' | 'dados' | 'enderecos'>('pedidos');

  showView(view: 'pedidos' | 'dados' | 'enderecos'): void {
    this.activeView.set(view);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}