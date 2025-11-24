import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service'; 
import { ProductDataService } from '../product-data.service'; // Importe o serviço de produtos
import { AppUser, Product } from '../core/types/types'; 
import { Router } from '@angular/router';
import { cpfValidator } from '../core/validators/cpf.validator';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
    '../account/account.component.css'
  ]
})
export class AdminComponent implements OnInit {

  private authService = inject(AuthService);
  private productService = inject(ProductDataService);
  private router = inject(Router);

  // Controle de visualização da tela
  activeView = signal<'users' | 'products'>('users');

  feedbackMessage = signal<{type: 'success' | 'error', text: string} | null>(null);
  
  // Sinais (Estados)
  users = signal<AppUser[]>([]); 
  products = signal<Product[]>([]);
  isModalOpen = signal(false);
  selectedUserForPassword = signal<AppUser | null>(null);

  // --- Formulários ---
  
  // 1. Formulário de Usuário (Antigo)
  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern(/^[0-9]+$/),
      cpfValidator()
    ]),
    password: new FormControl('', Validators.required),
    role: new FormControl<'admin' | 'user'>('user', Validators.required) 
  });

  // 2. Formulário de Senha (Antigo)
  passwordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  });

  // 3. Formulário de Produto (Novo)
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    category: new FormControl('correntes', Validators.required),
    imageMain: new FormControl('', Validators.required),
    imageExtra: new FormControl('') 
  });

  // Getters para facilitar uso no HTML
  get f() { return this.registerForm.controls; }
  get p() { return this.productForm.controls; } 

  ngOnInit(): void {
    // Carrega ambos ao iniciar
    this.loadUsers(); 
    this.loadProducts();
  }

  // --- Alternar Visualização ---
  switchView(view: 'users' | 'products'): void {
    this.activeView.set(view);
    this.feedbackMessage.set(null); // Limpa mensagens ao trocar de tela
  }

  // =========================================================
  // LÓGICA DE USUÁRIOS (Preservada do código antigo)
  // =========================================================

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

  openPasswordModal(user: AppUser): void {
    this.selectedUserForPassword.set(user);
    this.passwordForm.reset();
    this.isModalOpen.set(true);
  }

  closePasswordModal(): void {
    this.isModalOpen.set(false);
    this.selectedUserForPassword.set(null);
  }

  // =========================================================
  // LÓGICA DE PRODUTOS (Nova funcionalidade)
  // =========================================================

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (p) => this.products.set(p),
      error: (err) => console.error(err)
    });
  }

  handleRegisterProduct(): void {
    if (this.productForm.invalid) {
      this.feedbackMessage.set({type: 'error', text: 'Preencha todos os campos obrigatórios do produto.'});
      return;
    }

    const formVal = this.productForm.value;

    // Monta o array de imagens (main + extra se existir)
    const images: string[] = [];
    if (formVal.imageMain) images.push(formVal.imageMain);
    if (formVal.imageExtra) images.push(formVal.imageExtra);

    const newProduct: Omit<Product, 'id'> = {
      name: formVal.name!,
      description: formVal.description!,
      price: formVal.price!, 
      category: formVal.category!,
      images: images,
      sizes: ['Unico'] // Valor padrão
    };

    this.productService.addProduct(newProduct).subscribe({
      next: (createdProduct) => {
        this.products.update(curr => [...curr, createdProduct]);
        this.feedbackMessage.set({type: 'success', text: 'Produto cadastrado com sucesso!'});
        this.productForm.reset({ category: 'correntes' });
      },
      error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao cadastrar produto.'})
    });
  }

  handleDeleteProduct(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(curr => curr.filter(p => p.id !== id));
        this.feedbackMessage.set({type: 'success', text: 'Produto removido.'});
      },
      error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao remover produto.'})
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}