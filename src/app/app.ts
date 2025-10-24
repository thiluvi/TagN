import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './topbar/topbar';
import { Footer } from './footer/footer';
import { OverlayComponent } from './overlay/overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterOutlet,
      CommonModule,
      Topbar,
      Footer,
      OverlayComponent
    ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TagN');

  // --- Propriedades do Overlay ---
  // Certifique-se de que estas propriedades estão aqui, no nível da classe
  isOverlayVisible = false;
  overlayTitle = '';
  overlayContentType = ''; // Deve estar acessível aqui

  // Método atualizado para abrir o overlay
  handleOpenOverlay(type: string): void {
    this.overlayContentType = type;

    switch (type) {
      case 'Favoritos':
        this.overlayTitle = 'Favoritos';
        break;
      case 'Sacola':
        this.overlayTitle = 'Sacola de Compras';
        break;
      case 'Perfil':
        this.overlayTitle = 'Entrar ou Cadastrar';
        break;
      default:
        this.overlayTitle = '';
    }

    this.isOverlayVisible = true;
  }

  // Método para fechar o overlay
  handleCloseOverlay(): void {
    this.isOverlayVisible = false;
    this.overlayContentType = '';
  }
}