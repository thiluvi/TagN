import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, AppUser } from '../auth/auth.service'; // Importe AppUser
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
    '../account/account.component.css' // Reutilizando estilos
  ]
})
export class AdminComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  feedbackMessage = signal<{type: 'success' | 'error', text: string} | null>(null);
  users = signal<AppUser[]>([]); 
  isModalOpen = signal(false);
  selectedUserForPassword = signal<AppUser | null>(null);

  // --- Formulários ---
  
  // Este formulário PRECISA bater com os campos do HTML
  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern(/^[0-9]+$/) // Apenas números
    ]),
    password: new FormControl('', Validators.required),
    role: new FormControl<'admin' | 'user'>('user', Validators.required) 
  });

  passwordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  });

  // "Getter" para facilitar o acesso aos controles no HTML
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers(): void {
    this.authService.loadUsers().subscribe({
      next: (usersFromApi) => {
        this.users.set(usersFromApi);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.feedbackMessage.set({type: 'error', text: 'Não foi possível carregar a lista de usuários.'});
      }
    });
  }

  handleRegisterUser(): void {
    if (this.registerForm.invalid) {
      this.feedbackMessage.set({type: 'error', text: 'Formulário inválido. Verifique os campos.'});
      return;
    }
    
    // Omitimos 'id' porque o json-server vai criá-lo
    const newUser = this.registerForm.value as Omit<AppUser, 'id'>;

    this.authService.registerUser(newUser).subscribe({
      next: (createdUser) => {
        this.users.update(currentUsers => [...currentUsers, createdUser]);
        this.feedbackMessage.set({type: 'success', text: `Usuário "${createdUser.nome}" cadastrado!`});
        this.registerForm.reset({ role: 'user' });
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        this.feedbackMessage.set({type: 'error', text: 'Erro ao cadastrar usuário.'});
      }
    });
  }

  handleDeleteUser(userId: number): void {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== userId));
        this.feedbackMessage.set({type: 'success', text: 'Usuário deletado com sucesso.'});
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.feedbackMessage.set({type: 'error', text: 'Erro ao deletar usuário.'});
      }
    });
  }

  handleChangePassword(): void {
    if (this.passwordForm.invalid || !this.selectedUserForPassword()) {
      return;
    }

    const newPassword = this.passwordForm.value.newPassword!;
    const user = this.selectedUserForPassword()!;

    this.authService.updatePassword(user.id, newPassword).subscribe({
      next: () => {
        this.feedbackMessage.set({type: 'success', text: `Senha do ${user.nome} alterada.`});
        this.closePasswordModal();
      },
      error: (err) => {
        console.error('Erro ao alterar senha:', err);
        this.feedbackMessage.set({type: 'error', text: 'Erro ao alterar senha.'});
      }
    });
  }

  // --- Funções do Modal ---
  openPasswordModal(user: AppUser): void {
    this.selectedUserForPassword.set(user);
    this.passwordForm.reset();
    this.isModalOpen.set(true);
  }

  closePasswordModal(): void {
    this.isModalOpen.set(false);
    this.selectedUserForPassword.set(null);
  }

  // --- Função de Logout ---
  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}