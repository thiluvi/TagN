import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// Remova as importações de Login e Register
// import { LoginComponent } from '../auth/login/login.component';
// import { RegisterComponent } from '../auth/register/register.component';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule
    // Remova Login e Register dos imports
    // LoginComponent,
    // RegisterComponent 
  ],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.css']
})
export class OverlayComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() contentType = '';
  @Output() close = new EventEmitter<void>();

  // REMOVA tudo relacionado a 'authView'
  // authView = signal<'options' | 'login' | 'register'>('options');
  /*
  @Input()
  set contentTypeInput(value: string) {
    this.contentType = value;
    if (value === 'Perfil') {
      this.authView.set('options'); 
    }
  }
  */

  onClose(): void {
    // this.authView.set('options'); // Removido
    this.close.emit();
  }

  // REMOVA showLogin(), showRegister() e showOptions()
  /*
  showLogin(): void {
    this.authView.set('login');
  }
  ...etc
  */
}