import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Necessário para <router-outlet>
import { Topbar } from './topbar/topbar';
import { Footer } from './footer/footer';
import { OverlayComponent } from './overlay/overlay';
import { CommonModule } from '@angular/common'; // CommonModule geralmente é útil
// REMOVA os imports de: HeroBannerComponent, InfoStrip, CategoriesComponent, PopularProductsComponent, ProductDetailComponent daqui

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterOutlet, // Mantém esse
      CommonModule, // Mantém esse
      Topbar,       // Mantém esse (parte fixa do layout)
      Footer,       // Mantém esse (parte fixa do layout)
      OverlayComponent // Mantém esse (usado pelo Topbar)
      // REMOVA HeroBannerComponent, InfoStrip, CategoriesComponent, PopularProductsComponent, ProductDetailComponent daqui
    ],
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