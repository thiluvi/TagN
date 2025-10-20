import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.css']
})
export class PopularProductsComponent {
  // Dados dos produtos (no futuro, isto virá de uma API)
  products = [
    {
      name: 'CORRENTE VENEZIANA MASCULINA 60cm PRATA 925',
      price: '133,90',
      imageUrl: 'assets/images/Corrente PNG.png'
    },
    {
      name: 'Corrente Grumet Masculina 2 mm Prata 925',
      price: '135,90',
      imageUrl: 'assets/images/Corrente Grumet Masculina 2 mm.png'
    },
    {
      name: 'Corrente Veneziana Dupla Masculina Prata 925',
      price: '288,25',
      imageUrl: 'assets/images/Corrente Veneziana Dupla Masculina.png'
    },
    {
      name: 'Corrente Veneziana Masculina XL 70cm Prata 925',
      price: '209,80',
      imageUrl: 'assets/images/Corrente Veneziana Masculina XL.png'
    }
  ];
}