import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // 1. IMPORTE FORMSMODULE

@Component({
  selector: 'app-topbar',
  standalone: true, 
  imports: [RouterModule, FormsModule], // 2. ADICIONE FORMSMODULE AQUI
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  private router = inject(Router);

  @Output() openOverlay = new EventEmitter<string>();

  // 3. CRIE UM SIGNAL PARA O TERMO DE BUSCA
  public searchTerm = signal<string>('');

  onFavoritesClick(): void {
    this.openOverlay.emit('Favoritos');
  }

  onCartClick(): void {
    this.openOverlay.emit('Sacola');
  }

  onProfileClick(): void {
    this.router.navigate(['/conta']); 
  }

  // 4. CRIE O MÉTODO DE SUBMISSÃO DA BUSCA
  onSearchSubmit(): void {
    const term = this.searchTerm();
    if (term && term.trim() !== '') {
      // Navega para a página de busca com o termo como query param
      this.router.navigate(['/search'], { queryParams: { q: term } });
      this.searchTerm.set(''); // Limpa o input após a busca
    }
  }
}