import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.css']
})
export class PopularProductsComponent {
  // Pega uma referência do container dos produtos no HTML
  @ViewChild('productsGrid') productsGrid!: ElementRef;

  // Adicionei mais produtos para que o efeito de slider seja visível
  products = [
    { name: 'CORRENTE VENEZIANA MASCULINA 60cm PRATA 925', price: '133,90', imageUrl: 'assets/images/Corrente PNG.png' },
    { name: 'Corrente Grumet Masculina 2 mm Prata 925', price: '135,90', imageUrl: 'assets/images/Corrente Grumet Masculina 2 mm.png' },
    { name: 'Corrente Veneziana Dupla Masculina Prata 925', price: '288,25', imageUrl: 'assets/images/Corrente Veneziana Dupla Masculina.png' },
    { name: 'Corrente Veneziana Masculina XL 70cm Prata 925', price: '209,80', imageUrl: 'assets/images/Corrente Veneziana Masculina XL.png' },
    // Produtos adicionais para teste
    { name: 'CORRENTE VENEZIANA MASCULINA 60cm PRATA 925', price: '133,90', imageUrl: 'assets/images/Corrente PNG.png' },
    { name: 'Corrente Grumet Masculina 2 mm Prata 925', price: '135,90', imageUrl: 'assets/images/Corrente Grumet Masculina 2 mm.png' },
  ];

  /**
   * Move o carrossel para a esquerda ou direita.
   * @param direction -1 para a esquerda, 1 para a direita.
   */
  scroll(direction: number): void {
    const container = this.productsGrid.nativeElement;
    // Calcula o quanto rolar (aproximadamente a largura de 3 produtos)
    const scrollAmount = container.clientWidth * 0.8; 
    
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
}