import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule para *ngIf, etc.

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

  // Dados de exemplo (substitua por um serviço real depois)
  private allProducts: Product[] = [
    { id: '1', name: 'CORRENTE VENEZIANA MASCULINA FINA EM PRATA 925', description: 'A corrente veneziana masculina de 1 mm é o acessório ideal para quem busca elegância com discrição. Feita em prata 925, ela tem elos retos e bem agrupados, criando um visual fluido, moderno e minimalista. Uma corrente fina, versátil e resistente — perfeita para usar sozinha ou com pingente.', price: '103,50', images: ['assets/images/Corrente Homem.png', 'assets/images/Corrente tam 50.png', 'assets/images/Corrente na mao.png'], sizes: ['45', '50', '60', '70'] },
    { id: '2', name: 'Corrente Grumet Masculina 2 mm Prata 925', description: 'Descrição da corrente Grumet...', price: '135,90', images: ['assets/images/Corrente Grumet Masculina 2 mm.png' /* ... mais imagens */], sizes: ['50', '60', '70'] },
    { id: '3', name: 'Corrente Veneziana Dupla Masculina Prata 925', description: 'Descrição da veneziana dupla...', price: '288,25', images: ['assets/images/Corrente Veneziana Dupla Masculina.png' /* ... */], sizes: ['60', '70'] },
    { id: '4', name: 'Corrente Veneziana Masculina XL 70cm Prata 925', description: 'Descrição da veneziana XL...', price: '209,80', images: ['assets/images/Corrente Veneziana Masculina XL.png' /* ... */], sizes: ['70'] },
    // Adicione os outros produtos aqui com seus detalhes
    { id: '5', name: 'CORRENTE VENEZIANA MASCULINA 60cm PRATA 925',  description: 'Descrição da veneziana XL...', price: '133,90', images: ['assets/images/Corrente PNG.png'], sizes: ['50', '60', '70'] },
    { id: '6', name: 'Corrente Grumet Masculina 2 mm Prata 925', description: 'Descrição da veneziana XL...', price: '135,90', images: ['assets/images/Corrente Grumet Masculina 2 mm.png'], sizes: ['50', '60', '70'] }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Pega o parâmetro 'productId' da URL
    this.route.paramMap.subscribe(params => {
      const productId = params.get('productId');
      if (productId) {
        // Encontra o produto correspondente nos dados de exemplo
        this.product = this.allProducts.find(p => p.id === productId);
        // TODO: Lidar com o caso de produto não encontrado
      }
    });
  }
} 