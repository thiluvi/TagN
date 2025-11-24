import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service'; 
import { ProductDataService } from '../product-data.service';
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

  activeView = signal<'users' | 'products'>('users');
  feedbackMessage = signal<{type: 'success' | 'error', text: string} | null>(null);
  
  users = signal<AppUser[]>([]); 
  products = signal<Product[]>([]);
  isModalOpen = signal(false);
  selectedUserForPassword = signal<AppUser | null>(null);

  editingProductId = signal<string | null>(null); 
  
  availableSizes = ['Unico', 'PP', 'P', 'M', 'G', 'GG', '12', '14', '16', '18', '20', '22', '24', '35cm', '40cm', '45cm', '50cm', '60cm', '70cm'];
  selectedSizes = signal<string[]>(['Unico']); 

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

  passwordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  });

  // --- MUDANÇA AQUI: Regex atualizado para aceitar vírgula ---
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    // Regex: Aceita números, opcionalmente seguidos de virgula e 1 ou 2 casas (ex: 100 ou 100,50)
    price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(,\d{1,2})?$/)]), 
    category: new FormControl('correntes', Validators.required),
    imageMain: new FormControl('', Validators.required),
    imageExtra: new FormControl('') 
  });

  get f() { return this.registerForm.controls; }
  get p() { return this.productForm.controls; } 

  ngOnInit(): void {
    this.loadUsers(); 
    this.loadProducts();
  }

  switchView(view: 'users' | 'products'): void {
    this.activeView.set(view);
    this.feedbackMessage.set(null);
    this.cancelEditProduct(); 
  }

  loadUsers(): void {
    this.authService.loadUsers().subscribe({
      next: (u) => this.users.set(u),
      error: (e) => console.error(e)
    });
  }

  handleRegisterUser(): void {
    if (this.registerForm.invalid) return;
    const newUser = this.registerForm.value as Omit<AppUser, 'id'>;
    this.authService.registerUser(newUser).subscribe({
      next: (created) => {
        this.users.update(u => [...u, created]);
        this.feedbackMessage.set({type: 'success', text: 'Usuário criado!'});
        this.registerForm.reset({ role: 'user' });
      },
      error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao criar usuário.'})
    });
  }

  handleDeleteUser(id: number): void {
    if (!confirm('Deletar usuário?')) return;
    this.authService.deleteUser(id).subscribe({
      next: () => this.users.update(u => u.filter(x => x.id !== id)),
      error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao deletar.'})
    });
  }
  
  openPasswordModal(u: AppUser) { this.selectedUserForPassword.set(u); this.isModalOpen.set(true); }
  closePasswordModal() { this.isModalOpen.set(false); this.selectedUserForPassword.set(null); }
  
  handleChangePassword() { 
    if (this.passwordForm.invalid || !this.selectedUserForPassword()) return;
    const newPassword = this.passwordForm.value.newPassword!;
    const user = this.selectedUserForPassword()!;

    this.authService.updatePassword(user.id, newPassword).subscribe({
      next: () => {
        this.feedbackMessage.set({type: 'success', text: `Senha do ${user.nome} alterada.`});
        this.closePasswordModal();
      },
      error: (err) => {
        this.feedbackMessage.set({type: 'error', text: 'Erro ao alterar senha.'});
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (p) => this.products.set(p),
      error: (err) => console.error(err)
    });
  }

  toggleSize(size: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedSizes.update(current => {
      if (isChecked) {
        return [...current, size];
      } else {
        return current.filter(s => s !== size);
      }
    });
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes().includes(size);
  }

  handleEditProduct(product: Product): void {
    this.editingProductId.set(product.id);
    
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageMain: product.images[0] || '',
      imageExtra: product.images[1] || ''
    });

    if (product.sizes && product.sizes.length > 0) {
      this.selectedSizes.set(product.sizes);
    } else {
      this.selectedSizes.set(['Unico']);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.feedbackMessage.set({ type: 'success', text: `Editando: ${product.name}` });
  }

  cancelEditProduct(): void {
    this.editingProductId.set(null);
    this.productForm.reset({ category: 'correntes' });
    this.selectedSizes.set(['Unico']);
    this.feedbackMessage.set(null);
  }

  handleSubmitProduct(): void {
    // Validação com mensagem mais clara sobre a vírgula
    if (this.productForm.invalid) {
      this.feedbackMessage.set({type: 'error', text: 'Formulário inválido. O preço deve usar VÍRGULA (ex: 99,90).'});
      return;
    }

    if (this.selectedSizes().length === 0) {
      this.feedbackMessage.set({type: 'error', text: 'Selecione pelo menos um tamanho.'});
      return;
    }

    const formVal = this.productForm.value;
    const images: string[] = [];
    if (formVal.imageMain) images.push(formVal.imageMain);
    if (formVal.imageExtra) images.push(formVal.imageExtra);

    const productData = {
      name: formVal.name!,
      description: formVal.description!,
      price: formVal.price!, 
      category: formVal.category!,
      images: images,
      sizes: this.selectedSizes()
    };

    if (this.editingProductId()) {
      const updatedProduct: Product = { ...productData, id: this.editingProductId()! };
      
      this.productService.updateProduct(updatedProduct).subscribe({
        next: (res) => {
          this.products.update(curr => curr.map(p => p.id === res.id ? res : p));
          this.feedbackMessage.set({type: 'success', text: 'Produto atualizado com sucesso!'});
          this.cancelEditProduct(); 
        },
        error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao atualizar produto.'})
      });

    } else {
      this.productService.addProduct(productData).subscribe({
        next: (created) => {
          this.products.update(curr => [...curr, created]);
          this.feedbackMessage.set({type: 'success', text: 'Produto cadastrado!'});
          this.cancelEditProduct(); 
        },
        error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao cadastrar produto.'})
      });
    }
  }

  handleDeleteProduct(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(curr => curr.filter(p => p.id !== id));
        this.feedbackMessage.set({type: 'success', text: 'Produto removido.'});
        if (this.editingProductId() === id) this.cancelEditProduct();
      },
      error: () => this.feedbackMessage.set({type: 'error', text: 'Erro ao remover produto.'})
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}