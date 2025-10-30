import { Component, OnInit, signal } from '@angular/core'; // Importe 'signal'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';

// Defina uma interface simples para o produto (pode expandir depois)
interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // Ou number
  images: string[]; // Array de URLs das imagens
  sizes?: string[]; // Tamanhos disponíveis (opcional)
  // Adicione mais propriedades conforme necessário
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule], // Adicione CommonModule aqui
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined; // Propriedade para guardar os dados do produto
  // Use signal para o URL da imagem selecionada para melhor deteção de alterações (opcional mas recomendado)
  selectedImageUrl = signal<string | undefined>(undefined); 

  // ------------------------------------------------------------------------------------------------------
  selectedSize = signal<string | undefined>(undefined); // Para armazenar o tamanho selecionado
  quantity = signal<number>(1); // Para armazenar a quantidade (inicia em 1)
  // ------------------------------------------------------------------------------------------------------

  // Dados de exemplo (substitua por um serviço real depois)
  private allProducts: Product[] = [ //
    { id: '1', name: 'Corrente Veneziana Masculina 60cm Prata 925', 
      description: 'A corrente veneziana masculina de 1 mm é o acessório ideal para quem busca elegância com discrição.' + 
      'Feita em prata 925, ela tem elos retos e bem agrupados, criando um visual fluido, moderno e minimalista. Uma corrente fina, versátil e resistente — perfeita para usar sozinha ou com pingente.', 
      price: '103,50', 
      images: ['assets/images/Corrente PNG.png', 'assets/images/Corrente tam 50.png', 'assets/images/Corrente na mao.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['45', '50', '60', '70'] }, //

    { id: '2', name: 'Corrente Grumet Masculina 2 mm Prata 925', 
      description: 'Descrição da corrente Grumet...', 
      price: '135,90', 
      images: ['assets/images/Corrente Grumet Masculina 2 mm.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'] }, //

    { id: '3', name: 'Corrente Veneziana Dupla Masculina Prata 925', 
      description: 'Descrição da veneziana dupla...', 
      price: '288,25', 
      images: ['assets/images/Corrente Veneziana Dupla Masculina.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['60', '70'] }, //

    { id: '4', name: 'Corrente Veneziana Masculina XL 70cm Prata 925', 
      description: 'Descrição da veneziana XL...', 
      price: '209,80', 
      images: ['assets/images/Corrente Veneziana Masculina XL.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['70'] }, //

    // Adicione os outros produtos aqui com seus detalhes
    { id: '5', name: 'Corrente Cordão Baiano Fina Masculina Prata 925',  
      description: 'Descrição do cordão baiano ...', 
      price: '237,00', 
      images: ['assets/images/Corrente cordao baiano.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'] }, //

    { id: '6', name: 'Corrente Fígaro Masculina 2MM Prata 925', 
      description: 'Descrição da veneziana XL...', 
      price: '167,00', 
      images: ['assets/images/Corrente figaro.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'] } //
      
  ];

  constructor(private route: ActivatedRoute) {} //

  ngOnInit(): void { //
    // Pega o parâmetro 'productId' da URL
    this.route.paramMap.subscribe((params: ParamMap) => {//
      const productId = params.get('productId'); //
      if (productId) { //
        // Encontra o produto correspondente nos dados de exemplo
        this.product = this.allProducts.find(p => p.id === productId); //
        if (this.product && this.product.images.length > 0) { //
          // Define a imagem selecionada inicial como a primeira
          this.selectedImageUrl.set(this.product.images[0]); // Use .set() para signals //
        }
        // TODO: Lidar com o caso de produto não encontrado
      }
    });

    // ---------------------------------------------------------------------------------------------
    if (this.product && this.product.sizes && this.product.sizes.length > 0) {
      this.selectedSize.set(this.product.sizes[0]);
    }
    // ---------------------------------------------------------------------------------------------

  }

  // Método para mudar a imagem selecionada
  selectImage(imageUrl: string): void { //
    this.selectedImageUrl.set(imageUrl); // Use .set() para signals //
  }

  // -------------------------------------------------------------------------------------------------------
  // NOVO MÉTODO para selecionar o tamanho
  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  // NOVO MÉTODO para ajustar a quantidade
  adjustQuantity(delta: number): void {
    this.quantity.update(currentQuantity => {
      // Garante que a quantidade nunca seja menor que 1
      const newQuantity = currentQuantity + delta;
      return newQuantity > 0 ? newQuantity : 1;
    });
  }
  // -------------------------------------------------------------------------------------------------------
}