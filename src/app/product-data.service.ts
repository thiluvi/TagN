import { Injectable } from '@angular/core';

// Interface Product (copiada do product-detail.component.ts)
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  sizes?: string[];
  category: string; // NOVO CAMPO: Para categorizar
}

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  // Dados de exemplo com a nova propriedade 'category'
  private allProducts: Product[] = [
    { 
      id: '1', 
      name: 'Corrente Veneziana Masculina 60cm Prata 925', 
      description: 'A corrente veneziana masculina de 1 mm é o acessório ideal para quem busca elegância com discrição...', 
      price: '103,50', 
      images: ['assets/images/Corrente PNG.png', 'assets/images/Corrente tam 50.png', 'assets/images/Corrente na mao.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['45', '50', '60', '70'],
      category: 'correntes' // CATEGORIA
    },
    { 
      id: '2', 
      name: 'Corrente Grumet Masculina 2 mm Prata 925', 
      description: 'Descrição da corrente Grumet...', 
      price: '135,90', 
      images: ['assets/images/Corrente Grumet Masculina 2 mm.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'],
      category: 'correntes' // CATEGORIA
    },
    { 
      id: '3', 
      name: 'Corrente Veneziana Dupla Masculina Prata 925', 
      description: 'Descrição da veneziana dupla...', 
      price: '288,25', 
      images: ['assets/images/Corrente Veneziana Dupla Masculina.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['60', '70'],
      category: 'correntes' // CATEGORIA
    },
    { 
      id: '4', 
      name: 'Corrente Veneziana Masculina XL 70cm Prata 925', 
      description: 'Descrição da veneziana XL...', 
      price: '209,80', 
      images: ['assets/images/Corrente Veneziana Masculina XL.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['70'],
      category: 'correntes' // CATEGORIA
    },
    { 
      id: '5', 
      name: 'Corrente Cordão Baiano Fina Masculina Prata 925',  
      description: 'Descrição do cordão baiano ...', 
      price: '237,00', 
      images: ['assets/images/Corrente cordao baiano.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'],
      category: 'correntes' // CATEGORIA
    },
    { 
      id: '6', 
      name: 'Corrente Fígaro Masculina 2MM Prata 925', 
      description: 'Descrição da veneziana XL...', 
      price: '167,00', 
      images: ['assets/images/Corrente figaro.png', 'assets/images/Corrente Homem.png'], 
      sizes: ['50', '60', '70'],
      category: 'correntes' // CATEGORIA
    },



    // PULCEIRAS -----------------------------------------------------------------------------------------
    { 
      id: '20', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Pulseira.png', 'assets/images/Pulseiras.png'], 
      category: 'pulseiras' // CATEGORIA
    },
    { 
      id: '21', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Pulseira.png', 'assets/images/Pulseiras.png'], 
      category: 'pulseiras' // CATEGORIA
    },
    { 
      id: '22', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Pulseira.png', 'assets/images/Pulseiras.png'], 
      category: 'pulseiras' // CATEGORIA
    },
    { 
      id: '23', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Pulseira.png', 'assets/images/Pulseiras.png'], 
      category: 'pulseiras' // CATEGORIA
    },


    // ESCAPULARIO -----------------------------------------------------------------------------------------
    { 
      id: '40', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'assets/images/Escapulário.png'], 
      category: 'escapulario' // CATEGORIA
    },
    { 
      id: '41', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'assets/images/Escapulário.png'], 
      category: 'escapulario' // CATEGORIA
    },
    { 
      id: '42', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'assets/images/Escapulário.png'], 
      category: 'escapulario' // CATEGORIA
    },
    { 
      id: '43', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'assets/images/Escapulário.png'], 
      category: 'escapulario' // CATEGORIA
    },
    { 
      id: '44', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'escapulario' // CATEGORIA
    },

    // COLARES -----------------------------------------------------------------------------------------

    { 
      id: '60', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'colares' // CATEGORIA
    },
    { 
      id: '61', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'colares' // CATEGORIA
    },
    { 
      id: '62', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'colares' // CATEGORIA
    },
    { 
      id: '63', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'colares' // CATEGORIA
    },
    { 
      id: '64', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'colares' // CATEGORIA
    },


    // ANEIS -----------------------------------------------------------------------------------------
    { 
      id: '80', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'aneis' // CATEGORIA
    },
    { 
      id: '81', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'aneis' // CATEGORIA
    },
    { 
      id: '82', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'aneis' // CATEGORIA
    },
    { 
      id: '83', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'aneis' // CATEGORIA
    },

    // BRINCOS -----------------------------------------------------------------------------------------

    { 
      id: '100', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'brincos' // CATEGORIA
    },
    { 
      id: '101', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'brincos' // CATEGORIA
    },
    { 
      id: '102', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'brincos' // CATEGORIA
    },
    { 
      id: '103', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'brincos' // CATEGORIA
    },

    // PINGENTES -----------------------------------------------------------------------------------------

    { 
      id: '120', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'pingentes' // CATEGORIA
    },
    { 
      id: '121', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'pingentes' // CATEGORIA
    },
    { 
      id: '122', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'pingentes' // CATEGORIA
    },
    { 
      id: '123', 
      name: 'Pulseira Algema Rústica Prata 925', 
      description: 'Pulseira masculina estilo algema rústica.', 
      price: '199,00', 
      images: ['assets/images/Escapulário.png', 'Escapulário.png'], 
      category: 'pingentes' // CATEGORIA
    },

  ];

  // Método para filtrar produtos por categoria
  getProductsByCategory(category: string): Product[] {
    return this.allProducts.filter(p => p.category === category);
  }

  // Se for necessário, pode manter o método de buscar um único produto
  getProductById(id: string): Product | undefined {
    return this.allProducts.find(p => p.id === id);
  }
}