import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AccountComponent } from './account/account.component';
import { ProductListComponent } from './product-list/product-list.component';

// Importe os guards
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  // 1. Rota de login agora usa o loginGuard
  { 
    path: '', 
    component: LoginComponent,
    canActivate: [loginGuard] // Se já está logado, vai para /home
  }, 
  
  // 2. Rotas protegidas usam o authGuard
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] // Só acessa se estiver logado
  }, 
  { 
    path: 'products/:productId', 
    component: ProductDetailComponent,
    canActivate: [authGuard] // Só acessa se estiver logado
  },
  { 
    path: 'conta', 
    component: AccountComponent, 
    canActivate: [authGuard] // Só acessa se estiver logado
  },
  { 
    path: 'category/:categoryName', 
    component: ProductListComponent,
    canActivate: [authGuard] // Só acessa se estiver logado
  },
  
  { path: 'login', redirectTo: '', pathMatch: 'full' } 
];