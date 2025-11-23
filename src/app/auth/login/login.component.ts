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
  
  // --- Sinais para o Modal de "Esqueceu a Senha" ---
  showForgotPasswordModal = signal(false);
  forgotPasswordMessage = signal<{text: string, type: 'success' | 'error'} | null>(null);

  // Formulário de Login
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // Formulário de Troca de Senha
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  // --- Ações de Login ---
  handleLogin(): void {
    if (this.loginForm.invalid) {
      this.loginError.set('Por favor, preencha o email e a senha.');
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authService.login(email, password).subscribe({
      next: (user) => {
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
          this.loginError.set('Email ou senha inválidos.');
        }
      },
      error: (err) => {
        console.error('Erro de HTTP no login:', err);
        this.loginError.set('Erro ao conectar com o servidor. Tente novamente.');
      }
    });
  }

  // --- Ações do Modal "Esqueceu a Senha" ---
  
  openForgotPasswordModal(): void {
    this.showForgotPasswordModal.set(true);
    this.forgotPasswordForm.reset();
    this.forgotPasswordMessage.set(null);
  }

  closeForgotPasswordModal(): void {
    this.showForgotPasswordModal.set(false);
  }

  handleChangePassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordMessage.set({text: 'Preencha todos os campos corretamente.', type: 'error'});
      return;
    }

    const { email, oldPassword, newPassword } = this.forgotPasswordForm.value;

    // 1. Verifica se a senha antiga está correta tentando logar
    this.authService.login(email!, oldPassword!).subscribe({
      next: (user) => {
        if (user) {
          // 2. Se achou o usuário (senha antiga correta), atualiza para a nova
          this.authService.updatePassword(user.id, newPassword!).subscribe({
            next: () => {
              this.forgotPasswordMessage.set({text: 'Senha alterada com sucesso! Use a nova senha para entrar.', type: 'success'});
              // Fecha o modal após 2 segundos
              setTimeout(() => this.closeForgotPasswordModal(), 2000);
            },
            error: () => {
              this.forgotPasswordMessage.set({text: 'Erro ao salvar nova senha.', type: 'error'});
            }
          });
        } else {
          // 3. Se não achou (senha antiga errada), mostra a mensagem do Admin
          this.forgotPasswordMessage.set({
            text: 'Dados incorretos. Caso não lembre sua senha antiga, peça a um administrador para alterá-la.', 
            type: 'error'
          });
        }
      },
      error: () => {
        this.forgotPasswordMessage.set({text: 'Erro de conexão.', type: 'error'});
      }
    });
  }
}