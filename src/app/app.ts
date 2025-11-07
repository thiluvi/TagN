import { Component, signal, inject } from '@angular/core'; // Adicione 'inject'
import { RouterOutlet } from '@angular/router';
import { Topbar } from './topbar/topbar';
import { Footer } from './footer/footer';
import { OverlayComponent } from './overlay/overlay';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service'; // IMPORTAR O SERVIÇO

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

  // Injete o serviço de autenticação
  // Tornamos público (public) para que o template (app.html) possa acessá-lo
  public authService = inject(AuthService); 

  isOverlayVisible = false;
  overlayTitle = '';
  overlayContentType = ''; 

  handleOpenOverlay(type: string): void {
    this.overlayContentType = type;

    switch (type) {
      case 'Favoritos':
        this.overlayTitle = 'Favoritos';
        break;
      case 'Sacola':
        this.overlayTitle = 'Sacola de Compras';
        break;
      // O caso 'Perfil' foi removido do overlay
      default:
        this.overlayTitle = '';
    }

    this.isOverlayVisible = true;
  }

  handleCloseOverlay(): void {
    this.isOverlayVisible = false;
    this.overlayContentType = '';
  }
}