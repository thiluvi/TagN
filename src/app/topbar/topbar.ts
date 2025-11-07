import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importe Router

@Component({
  selector: 'app-topbar',
  standalone: true, 
  imports: [RouterModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  // Injeção do Router
  private router = inject(Router);

  // Emite o título do overlay a ser aberto
  @Output() openOverlay = new EventEmitter<string>();

  onFavoritesClick(): void {
    this.openOverlay.emit('Favoritos');
  }

  onCartClick(): void {
    this.openOverlay.emit('Sacola');
  }

  // Método ATUALIZADO para o clique no perfil
  onProfileClick(): void {
    // this.openOverlay.emit('Perfil'); // Removemos isso
    this.router.navigate(['/conta']); // Navega para a página de conta
  }
}