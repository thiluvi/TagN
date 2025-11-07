import { Component, inject, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../auth.service'; // Importe o AuthService
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

    // 1. O login agora é assíncrono, então usamos .subscribe()
    this.authService.login(email, password).subscribe({
      next: (user) => {
        // 2. Verificamos o usuário retornado DENTRO do subscribe
        if (user) {
          switch (user.role) {
            case 'admin':
              this.router.navigate(['/admin']);
              break;
            case 'user':
              this.router.navigate(['/home']);
              break;
            default:
              this.loginError.set('Role de usuário desconhecida.');
          }
        } else {
          // Se o 'user' for nulo, o login falhou
          this.loginError.set('Email ou senha inválidos.');
        }
      },
      error: (err) => {
        console.error('Erro de HTTP no login:', err);
        this.loginError.set('Erro ao conectar com o servidor. Tente novamente.');
      }
    });
  }
}