import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './topbar/topbar';
import { Footer } from './footer/footer';
import { HeroBannerComponent } from './hero-banner/hero-banner';
import { InfoStrip } from './info-strip/info-strip';
import { OverlayComponent } from './overlay/overlay';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { PopularProductsComponent } from './popular-products/popular-products.component';

@Component({
  selector: 'app-root',
  standalone: true, // Adicionado
  imports: [RouterOutlet, Topbar, Footer, HeroBannerComponent, InfoStrip,
     OverlayComponent, CommonModule, CategoriesComponent, PopularProductsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TagN');

  // Propriedades para controlar o overlay
  isOverlayVisible = false;
  overlayTitle = '';

  // Método para abrir o overlay
  handleOpenOverlay(title: string): void {
    this.overlayTitle = title;
    this.isOverlayVisible = true;
  }

  // Método para fechar o overlay
  handleCloseOverlay(): void {
    this.isOverlayVisible = false;
  }
}
