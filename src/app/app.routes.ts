import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component'; // Importe o HomeComponent

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota raiz para a página inicial
  { path: 'products/:productId', component: ProductDetailComponent }
];