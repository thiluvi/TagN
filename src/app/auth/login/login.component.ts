import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() goToRegister = new EventEmitter<void>();

  switchToRegister(): void {
    this.goToRegister.emit();
  }
}