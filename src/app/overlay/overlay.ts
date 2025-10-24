import { Component, Input, Output, EventEmitter, signal } from '@angular/core'; // Adicione signal
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component'; // Importe LoginComponent
import { RegisterComponent } from '../auth/register/register.component'; // Importe RegisterComponent

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,     // Adicione aqui
    RegisterComponent   // Adicione aqui
  ],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.css']
})
export class OverlayComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() contentType = '';
  @Output() close = new EventEmitter<void>();

  // Signal para controlar qual view (login ou register) mostrar dentro do overlay 'Perfil'
  authView = signal<'login' | 'register'>('login');

  onClose(): void {
    this.authView.set('login'); // Reseta para login ao fechar
    this.close.emit();
  }

  showLogin(): void {
    this.authView.set('login');
  }

  showRegister(): void {
    this.authView.set('register');
  }
}