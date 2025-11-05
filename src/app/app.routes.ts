import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
// Importe os componentes de login e cadastro
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountComponent } from './account/account.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota raiz para a página inicial
  { path: 'products/:productId', component: ProductDetailComponent },
  // Adicione as rotas para login e cadastro
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Adicione outras rotas aqui se necessário
  { path: 'conta', component: AccountComponent }, // Você pode mudar 'conta' para 'perfil', etc.
  // Futuramente, adicionar um CanActivate guard aqui para proteger a rota
  { path: 'category/:categoryName', component: ProductListComponent }
];