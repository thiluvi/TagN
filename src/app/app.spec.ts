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

  isOverlayVisible = false;
  overlayTitle = '';
  overlayContentType = ''; // Nova propriedade para o tipo de conteúdo

  // Método atualizado para abrir o overlay
  handleOpenOverlay(type: string): void {
    this.overlayContentType = type; // Guarda o tipo ('Favoritos', 'Sacola', 'Perfil')

    // Define o título baseado no tipo
    switch (type) {
      case 'Favoritos':
        this.overlayTitle = 'Favoritos';
        break;
      case 'Sacola':
        this.overlayTitle = 'Sacola de Compras';
        break;
      case 'Perfil':
        this.overlayTitle = 'Entrar ou Cadastrar'; // Ou apenas 'Minha Conta'
        break;
      default:
        this.overlayTitle = ''; // Título padrão ou erro
    }

    this.isOverlayVisible = true;
  }

  // Método para fechar o overlay
  handleCloseOverlay(): void {
    this.isOverlayVisible = false;
    this.overlayContentType = ''; // Limpa o tipo ao fechar
  }
}