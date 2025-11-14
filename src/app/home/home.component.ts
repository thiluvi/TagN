import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

// Importe os componentes da página inicial
import { HeroBannerComponent } from '../hero-banner/hero-banner';
import { InfoStrip } from '../info-strip/info-strip';
import { CategoriesComponent } from '../categories/categories.component';
import { PopularProductsComponent } from '../popular-products/popular-products.component';

// 1. IMPORTE A NOVA DIRETIVA
import { ScrollFadeDirective } from '../core/directives/scroll-fade.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    InfoStrip,
    CategoriesComponent,
    PopularProductsComponent,
    ScrollFadeDirective // 2. ADICIONE A DIRETIVA AOS IMPORTS
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}