import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AccountComponent } from './account/account.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AdminComponent } from './admin/admin.component'; // 1. Importe o AdminComponent

// Importe os guards
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { adminGuard } from './auth/admin.guard'; // 2. Importe o AdminGuard

export const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent,
    canActivate: [loginGuard] 
  }, 
  
  // 3. Adicione a nova rota /admin protegida
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard] // Apenas admins podem acessar
  },

  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] 
  }, 
  { 
    path: 'products/:productId', 
    component: ProductDetailComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'conta', 
    component: AccountComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'category/:categoryName', 
    component: ProductListComponent,
    canActivate: [authGuard] 
  },
  
  { path: 'login', redirectTo: '', pathMatch: 'full' } 
];