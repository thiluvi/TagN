import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service'; // Importe o AuthService
import { Router } from '@angular/router'; // Importe o Router

// Vamos criar uma interface para o usuário
interface User {
  id: number; // O JsonServer vai criar isso
  nome: string;
  email: string;
  cpf: string;
  role: 'admin' | 'user';
  // A senha não deve ser trazida para o front, mas precisamos dela para criar
  password?: string; 
}

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

  // Injeção de dependências
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Sinais (Signals) ---
  feedbackMessage = signal<{type: 'success' | 'error', text: string} | null>(null);
  
  // Lista simulada de usuários (virá do JsonServer no futuro)
  users = signal<User[]>([]);

  // Sinais para o Modal de Alterar Senha
  isModalOpen = signal(false);
  selectedUserForPassword = signal<User | null>(null);

  // --- Formulários ---
  
  // Formulário para cadastrar novo usuário (atualizado com senha)
  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [Validators.required]), // TODO: Adicionar validador de CPF
    password: new FormControl('', Validators.required),
    role: new FormControl<'admin' | 'user'>('user', Validators.required) 
  });

  // Novo formulário para alterar a senha
  passwordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    // Carrega os usuários simulados ao iniciar o componente
    this.loadUsers();
  }

  loadUsers(): void {
    // SIMULAÇÃO (substituir por chamada HTTP GET ao JsonServer)
    const mockUsers: User[] = [
      { id: 1, nome: 'Admin Senac', email: 'admin@senac.com', cpf: '11122233344', role: 'admin' },
      { id: 2, nome: 'Usuário Comum', email: 'user@senac.com', cpf: '55566677788', role: 'user' }
    ];
    this.users.set(mockUsers);
  }

  // --- Funções de CRUD ---

  handleRegisterUser(): void {
    if (this.registerForm.invalid) {
      this.feedbackMessage.set({type: 'error', text: 'Formulário inválido. Verifique os campos.'});
      return;
    }

    // LÓGICA DO PROJETO (Futuro: POST no JsonServer)
    const newUser = { id: Date.now(), ...this.registerForm.value } as User;
    console.log('Admin cadastrando novo usuário:', newUser);
    
    // Simulação de sucesso: Adiciona o usuário na lista local
    this.users.update(currentUsers => [...currentUsers, newUser]);
    
    this.feedbackMessage.set({type: 'success', text: `Usuário ${newUser.nome} cadastrado!`});
    this.registerForm.reset({ role: 'user' });
  }

  handleDeleteUser(userId: number): void {
    // Confirmação
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    // LÓGICA DO PROJETO (Futuro: DELETE no JsonServer)
    console.log('Deletando usuário ID:', userId);

    // Simulação de sucesso: Remove o usuário da lista local
    this.users.update(users => users.filter(u => u.id !== userId));
    this.feedbackMessage.set({type: 'success', text: 'Usuário deletado com sucesso.'});
  }

  handleChangePassword(): void {
    if (this.passwordForm.invalid || !this.selectedUserForPassword()) {
      return;
    }

    const newPassword = this.passwordForm.value.newPassword;
    const user = this.selectedUserForPassword();

    // LÓGICA DO PROJETO (Futuro: PATCH/PUT no JsonServer)
    console.log(`Alterando senha do usuário ${user?.email} para: ${newPassword}`);
    
    this.feedbackMessage.set({type: 'success', text: `Senha do ${user?.nome} alterada.`});
    this.closePasswordModal();
  }

  // --- Funções do Modal ---

  openPasswordModal(user: User): void {
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
    this.router.navigate(['/']); // Redireciona para o login
  }
}