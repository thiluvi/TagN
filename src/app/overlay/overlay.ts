import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.css']
})
export class OverlayComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() contentType = '';
  @Output() close = new EventEmitter<void>();

  // Signal para controlar qual view (opções, login ou register) mostrar
  authView = signal<'options' | 'login' | 'register'>('options'); // Estado inicial: 'options'

  // Quando o tipo de conteúdo muda para 'Perfil', resetamos para 'options'
  // Usamos um setter para o Input contentType para detectar a mudança
  @Input()
  set contentTypeInput(value: string) {
    this.contentType = value;
    if (value === 'Perfil') {
      this.authView.set('options'); // Garante que sempre comece pelas opções
    }
  }


  onClose(): void {
    this.authView.set('options'); // Reseta para options ao fechar
    this.close.emit();
  }

  showLogin(): void {
    this.authView.set('login');
  }

  showRegister(): void {
    this.authView.set('register');
  }

  // Opcional: Método para voltar às opções (se precisar de um botão "voltar")
  showOptions(): void {
    this.authView.set('options');
  }
}