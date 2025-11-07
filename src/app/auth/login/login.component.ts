// Adicione 'signal' aqui
import { Component, inject, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../auth.service'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule 
  ], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  handleLogin(): void {
    if (this.loginForm.invalid) {
      this.loginError.set('Por favor, preencha o email e a senha.');
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const sucesso = this.authService.login(email, password);

    if (sucesso) {
      this.router.navigate(['/home']);
    } else {
      this.loginError.set('Email ou senha inválidos.');
    }
  }
}