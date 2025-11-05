import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() goToLogin = new EventEmitter<void>();

  switchToLogin(): void {
    this.goToLogin.emit();
  }
}