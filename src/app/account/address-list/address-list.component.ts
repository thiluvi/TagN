import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddressService } from '../../core/services/address.service';
import { AuthService } from '../../auth/auth.service';
import { Address } from '../../core/types/types';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.css'
})
export class AddressListComponent implements OnInit {
  private authService = inject(AuthService);
  private addressService = inject(AddressService);

  addresses = signal<Address[]>([]);
  feedbackMessage = signal<{type: 'success' | 'error', text: string} | null>(null);

  // NOVO: Signal para controlar o modo de edição
  editingAddressId = signal<number | null>(null);

  addressForm = new FormGroup({
    cep: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{5}-?[0-9]{3}$/)]),
    rua: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    estado: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)])
  });

  // NOVO: Getter para facilitar o acesso aos controles no HTML
  get a() {
    return this.addressForm.controls;
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.addressService.getAddressesByUserId(userId).subscribe(data => {
        this.addresses.set(data);
      });
    }
  }

  // ATUALIZADO: Esta função agora cuida de ADICIONAR e ATUALIZAR
  handleSubmitAddress(): void {
    if (this.addressForm.invalid) {
      this.feedbackMessage.set({ type: 'error', text: 'Formulário inválido. Verifique os campos.' });
      return;
    }

    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.feedbackMessage.set({ type: 'error', text: 'Erro: Usuário não encontrado.' });
      return;
    }

    // Prepara os dados do formulário
    const addressData = {
      ...this.addressForm.value,
      userId: userId
    } as Address; // Usamos a interface completa

    // Verifica se está em modo de edição
    const currentId = this.editingAddressId();
    if (currentId !== null) {
      // --- LÓGICA DE ATUALIZAR ---
      this.addressService.updateAddress(currentId, addressData).subscribe({
        next: (updatedAddress) => {
          // Atualiza o signal: substitui o endereço antigo pelo novo
          this.addresses.update(list => 
            list.map(addr => addr.id === currentId ? updatedAddress : addr)
          );
          this.feedbackMessage.set({ type: 'success', text: 'Endereço atualizado com sucesso!' });
          this.handleCancelEdit(); // Limpa o formulário e sai do modo de edição
        },
        error: () => this.feedbackMessage.set({ type: 'error', text: 'Erro ao atualizar o endereço.' })
      });

    } else {
      // --- LÓGICA DE ADICIONAR ---
      this.addressService.addAddress(addressData).subscribe({
        next: (createdAddress) => {
          this.addresses.update(list => [...list, createdAddress]);
          this.addressForm.reset();
          this.feedbackMessage.set({ type: 'success', text: 'Endereço adicionado com sucesso!' });
        },
        error: () => this.feedbackMessage.set({ type: 'error', text: 'Erro ao salvar o endereço.' })
      });
    }
  }

  // NOVO: Preenche o formulário para edição
  handleEditClick(address: Address): void {
    this.editingAddressId.set(address.id);
    this.addressForm.patchValue(address); // Preenche o formulário
    this.feedbackMessage.set(null); // Limpa mensagens antigas
  }

  // NOVO: Cancela o modo de edição
  handleCancelEdit(): void {
    this.editingAddressId.set(null);
    this.addressForm.reset();
    this.feedbackMessage.set(null);
  }

  // NOVO: Deleta um endereço
  handleDeleteAddress(addressId: number): void {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.addressService.deleteAddress(addressId).subscribe({
        next: () => {
          // Atualiza o signal: remove o endereço da lista
          this.addresses.update(list => list.filter(addr => addr.id !== addressId));
          this.feedbackMessage.set({ type: 'success', text: 'Endereço excluído.' });
        },
        error: () => this.feedbackMessage.set({ type: 'error', text: 'Erro ao excluir o endereço.' })
      });
    }
  }
}