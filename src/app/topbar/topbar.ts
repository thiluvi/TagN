import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true, // Adicionado
  imports: [RouterModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  // Emite o título do overlay a ser aberto
  @Output() openOverlay = new EventEmitter<string>();

  onFavoritesClick(): void {
    this.openOverlay.emit('Favoritos');
  }

  onCartClick(): void {
    this.openOverlay.emit('Sacola');
  }

  // Novo método para o clique no perfil
  onProfileClick(): void {
    this.openOverlay.emit('Perfil'); // Emite 'Perfil'
  }
}