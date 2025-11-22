import { Component, signal, inject, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../auth/auth.service'; 
import { Router } from '@angular/router'; 
import { OrderService } from '../core/services/order.service'; // 1. Importe

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
  private orderService = inject(OrderService); // 2. Injete
  private router = inject(Router);

  userEmail = computed(() => this.authService.currentUser()?.email ?? 'email@...com');
  
  // 3. Exponha a lista de pedidos para o HTML
  userOrders = this.orderService.orders;

  activeView = signal<'pedidos' | 'dados' | 'enderecos'>('pedidos');

  showView(view: 'pedidos' | 'dados' | 'enderecos'): void {
    this.activeView.set(view);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}