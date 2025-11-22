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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  sizes?: string[];
  category: string; 
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  status: 'Processando' | 'Enviado' | 'Entregue';
}