// Esta interface já deve existir no seu AuthService, 
// mas centralizar ela aqui é uma boa prática.
export interface AppUser {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: 'admin' | 'user';
  password?: string;
}

// NOVA INTERFACE
export interface Address {
  id: number;
  userId: number;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}