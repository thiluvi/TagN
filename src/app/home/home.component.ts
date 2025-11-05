import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule é bom ter

// Importe os componentes da página inicial
import { HeroBannerComponent } from '../hero-banner/hero-banner';
import { InfoStrip } from '../info-strip/info-strip';
import { CategoriesComponent } from '../categories/categories.component';
import { PopularProductsComponent } from '../popular-products/popular-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  // Adicione os componentes importados aqui
  imports: [
    CommonModule,
    HeroBannerComponent,
    InfoStrip,
    CategoriesComponent,
    PopularProductsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Corrigido para styleUrls
})
export class HomeComponent {

}