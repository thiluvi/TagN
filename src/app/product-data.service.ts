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
      name: 'Pulseira Esteira Masculina em Prata 925',
      description: 'A pulseira esteira de prata que une textura, brilho e versatilida. Com sua trama entrelaçada e acabamento cintilante, a Pulseira Esteira é a escolha ideal para quem busca um acessório sofisticado e confortável.',
      price: '197,00',
      images: ['assets/images/pulseira01.png', 'assets/images/pulseira01.png'],
      category: 'pulseiras' // CATEGORIA
    },
    {
      id: '21',
      name: 'Pulseira Grumet 4 mm em Prata 925',
      description: 'Seu design mais robusto transmite força, estilo e personalidade — perfeita para compor um visual ousado e elegante ao mesmo tempo.',
      price: '157,00',
      images: ['assets/images/pulseira02.png', 'assets/images/pulseira02.png'],
      category: 'pulseiras' // CATEGORIA
    },
    {
      id: '22',
      name: 'Pingente de Prata Pedra Cristal Verde Cravejado',
      description: 'O Pingente Pedra Cristal Verde Cravejado em Prata 925 combina intensidade e elegância em um design atemporal. A zircônia verde central simboliza equilíbrio e renovação, enquanto o contorno de zircônias cristalinas reflete a luz com sutileza e destaque. Uma peça que une força, espiritualidade e sofisticação em cada detalhe.',
      price: '109,00',
      images: ['assets/images/pulseira4.png', 'assets/images/pulseira4.png'],
      category: 'pulseiras' // CATEGORIA
    },
    {
      id: '23',
      name: 'Pulseira de Prata elo cartier',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada da Argennti, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '169,90',
      images: ['assets/images/pulseira5.png', 'assets/images/pulseira5.png'],
      category: 'pulseiras' // CATEGORIA
    },
   
    {
      id: '24',
      name: 'Pulseira Grumet Cubana 3 mm em Prata 925',
      description: 'Com presença marcante e acabamento refinado, a Pulseira Cubana 3 mm em Prata 925 é um acessório robusto que traduz atitude e sofisticação. ',
      price: '276,00',
      images: ['assets/images/pulseira3.png', 'assets/images/pulseira3.png'],
      category: 'pulseiras' // CATEGORIA
    },
 
    {
      id: '25',
      name: 'Pulseira Fígaro 4 mm Masculina em Prata 925',
      description: 'Com elos alternados que criam ritmo visual, a Pulseira Fígaro 4 mm é a escolha ideal para quem deseja um acessório tradicional com toque de personalidade. A combinação de um elo longo seguido de três curtos cria um design elegante, mas com presença no pulso.',
      price: '149,00',
      images: ['assets/images/pulseira6.png', 'assets/images/pulseira6.png'],
      category: 'pulseiras' // CATEGORIA
    },
 
 
    // ESCAPULARIO -----------------------------------------------------------------------------------------
    {
      id: '40',
      name: 'Escapulário Medalha São Bento - Corrente Veneziana',
      description: 'O escapulário masculino São Bento na corrente veneziana fina é mais do que uma joia: é um amuleto de proteção espiritual aliado à estética refinada da prata 925. Com duas medalhas de São Bento e corrente de elos finos e delicados, essa peça transmite fé e estilo com discrição e sofisticação.',
      price: '197,00',
      images: ['assets/images/escapulario1.png', 'assets/images/doescapulario1.png'],
      category: 'escapulario' // CATEGORIA
    },
    {
      id: '41',
      name: 'Escapulário de Prata 60 cm - Corrente Veneziana',
      description: 'O escapulário masculino em prata com corrente veneziana de 60 cm é uma joia discreta e poderosa, que carrega o valor espiritual da fé cristã. Com placas fixas e a imagem tradicional do escapulário católico, é ideal para uso diário e combina com diferentes estilos.',
      price: '187,00',
      images: ['assets/images/escapulario2.png', 'assets/images/doescapulario2.png'],
      category: 'escapulario' // CATEGORIA
    },
    {
      id: '42',
      name: 'Escapulário de Prata - Corrente Grumet',
      description: 'Com uma estética mais marcante e tradicional, o escapulário masculino em corrente grumet de 1 mm em prata 925 une a simbologia espiritual à identidade clássica da joalheria masculina. Uma peça versátil, atemporal e ideal para quem busca expressar sua devoção com elegância e personalidade.',
      price: '345,00',
      images: ['assets/images/escapulario3.png', 'assets/images/doescapulario3.png'],
      category: 'escapulario' // CATEGORIA
    },
    {
      id: '43',
      name: 'Escapulário Medalha Pai Nosso em Prata 925',
      description: 'O escapulário masculino de prata com a oração do Pai Nosso une espiritualidade e elegância. Gravado com uma das orações mais poderosas da fé cristã, ele carrega proteção, conexão interior e uma estética minimalista que combina com qualquer estilo.',
      price: '378,00',
      images: ['assets/images/escapulario4.png', 'assets/images/doescapulari04.png'],
      category: 'escapulario' // CATEGORIA
    },
    {
      id: '44',
      name: 'Escapulário de Prata Cravejado Nossa S. Aparecida',
      description: 'O escapulário masculino de Nossa Senhora Aparecida em prata 925 é um símbolo de fé, proteção e tradição religiosa. Uma peça que carrega espiritualidade em cada detalhe, com duas placas fixas que representam a devoção e o cuidado da padroeira do Brasil.',
      price: '250,00',
      images: ['assets/images/escapulario5.png'],
      category: 'escapulario' // CATEGORIA
    },
 
    // COLARES -----------------------------------------------------------------------------------------
 
    {
      id: '60',
      name: 'Colar de Prata com Pedra Cristal Turquesa Cravejado',
      description: 'O Colar de Prata com Pedra Cristal Turquesa Cravejada é uma peça que une beleza vibrante com um toque simbólico especial. O pingente arredondado traz ao centro uma zircônia turquesa, cercada por um aro de zircônias cristalinas, criando uma composição elegante e cheia de luz. Ideal para homens que desejam carregar estilo e significado em um acessório sofisticado.',
      price: '187,00',
      images: ['assets/images/colar1.png', 'assets/images/docolar1.png'],
      category: 'colares' // CATEGORIA
    },
    {
      id: '61',
      name: 'Colar de Prata com Pedra Cristal Cravejado',
      description: 'O pingente redondo é composto por uma zircônia incolor central, envolvida por um contorno de zircônias cristalinas, criando um efeito de luz intenso e refinado. A corrente veneziana confere um acabamento delicado, tornando o colar ideal para compor desde visuais discretos até produções mais marcantes. Uma peça versátil e encantadora para todos os estilos.',
      price: '138,00',
      images: ['assets/images/colar2.png', 'docolar2.png'],
      category: 'colares' // CATEGORIA
    },
    {
      id: '62',
      name: 'Colar de Prata com Pedra Cristal Verde Cravejado',
      description: 'Com um design que transmite elegância e personalidade, o Colar Masculino de Prata com Pedra Cristal Verde Cravejada é uma escolha marcante para homens que apreciam joias refinadas com presença. O pingente arredondado em zircônia verde é rodeado por zircônias cristalinas, formando uma peça que atrai olhares e complementa com estilo tanto looks casuais quanto mais elegantes.',
      price: '167,00',
      images: ['assets/images/colar3.png'],
      category: 'colares' // CATEGORIA
    },
    {
      id: '63',
      name: 'Colar Masculino Cristal Slim em Prata 925.',
      description: 'O colar masculino cristal slim em prata 925 traz a delicadeza da corrente veneziana e o brilho sutil do pingente em zircônia. Um acessório pensado para homens que valorizam sofisticação, leveza e presença, tudo na medida certa.',
      price: '167,00',
      images: ['assets/images/colar4.png'],
      category: 'colares' // CATEGORIA
    },
    {
      id: '64',
      name: 'Colar de Prata Crucifixo Cravejado Preto Pequeno..',
      description: 'O Colar Crucifixo Cravejado Preto Pequeno é uma peça em prata 925 masculina, que une espiritualidade e sofisticação. Com zircônias cristalinas cravejadas ao redor e zircônias pretas em seu interior, essa joia traz uma leitura moderna e ousada do clássico crucifixo, sem perder sua essência de fé e proteção.',
      price: '199,00',
      images: ['assets/images/colar5.png'],
      category: 'colares' // CATEGORIA
    },
 
 
    // ANEIS -----------------------------------------------------------------------------------------
    {
      id: '80',
      name: 'Anel Square em Prata 925',
      description: 'O Anel Square em Prata 925 da Argennti é uma joia que expressa força, estabilidade e elegância minimalista. Seu formato quadrado, de linhas precisas e acabamento polido, cria uma estética contemporânea e imponente, perfeita para homens que apreciam acessórios com identidade e proporção. Produzido em prata maciça, o anel traduz a harmonia entre simplicidade e presença.',
      price: '280,00',
      images: ['assets/images/anel1.png', 'assets/images/doanel1.png'],
      category: 'aneis' // CATEGORIA
    },
    {
      id: '81',
      name: 'Anel de São Bento Cravejado em Prata 925',
      description: ' Anel de São Bento Cravejado em Prata 925 da Argennti é uma joia que une espiritualidade e sofisticação em uma só peça. Com a tradicional medalha de São Bento em destaque e cravejamento delicado de zircônias cristalinas ao redor, o anel simboliza proteção divina e força interior. A joia ideal para quem carrega a fé como parte do seu estilo.',
      price: '320,00',
      images: ['assets/images/anel2.png', 'assets/images/doanel2.png'],
      category: 'aneis' // CATEGORIA
    },
    {
      id: '82',
      name: 'Anel Coroa Slim em Prata 925',
      description: 'O Anel Coroa Slim Facetado em Prata 925 da Argennti é uma joia que une força simbólica e elegância contemporânea. Inspirado na forma de uma coroa, o anel apresenta facetas delicadas que refletem a luz de forma sutil, criando um brilho refinado e cheio de personalidade. Produzido em prata legítima, é um símbolo de poder interior e estilo autêntico, ideal para homens que lideram com confiança e presença.',
      price: '199,00',
      images: ['assets/images/anel3.png', 'assets/images/doanel3.png'],
      category: 'aneis' // CATEGORIA
    },
    {
      id: '83',
      name: 'Anel Square Preto em Prata 925',
      description: 'O Anel Square Preto em Prata 925 da Argennti combina design arquitetônico e estilo contemporâneo em uma peça de presença inconfundível. Seu topo quadrado com detalhe retangular em acetato preto cria um contraste sofisticado entre brilho e profundidade, resultando em uma joia moderna e equilibrada.',
      price: '320,00',
      images: ['assets/images/anel4.png'],
      category: 'aneis' // CATEGORIA
    },
 
    {
      id: '84',
      name: 'Anel de Prata Cravejado Preto Slim',
      description: 'Nossas joias são fabricadas de prata 925 maciça. Não trabalhamos com peças banhadas ou folheadas. Garantimos a qualidade e autenticidade de cada peça.',
      price: '297,00',
      images: ['assets/images/anel5.png'],
      category: 'aneis' // CATEGORIA
    },
 
    {
      id: '85',
      name: 'Anel de Sinete Pássaro em Prata 925',
      description: 'O Anel de Sinete Pássaro em Prata 925 da Argennti é uma joia que une espiritualidade e estilo em um formato clássico de sinete. Seu topo apresenta o desenho de um pássaro em voo, símbolo de liberdade, fé e elevação espiritual. Produzido em prata maciça 925, o anel combina presença e sutileza em uma peça que expressa força interior e propósito em cada detalhe.',
      price: '197,00',
      images: ['assets/images/anel6.png'],
      category: 'aneis' // CATEGORIA
    },
 
    // BRINCOS -----------------------------------------------------------------------------------------
 
    {
      id: '100',
      name: 'Brinco de Prata Argola Cravejada Square',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '117,75',
      images: ['assets/images/brinco1.png', 'dobrinco1.png'],
      category: 'brincos' // CATEGORIA
    },
    {
      id: '101',
      name: 'Brinco de Prata Argola Torcida',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.O material utilizado na fabricação das nossas joias é prata 925. Nossas peças são 100% de prata 925 de lei.',
      price: '89,25',
      images: ['assets/images/brinco2.png', 'brinco2.png'],
      category: 'brincos' // CATEGORIA
    },
    {
      id: '102',
      name: 'Brinco de Prata Argola Cravejada Slim',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '109,00',
      images: ['assets/images/brinco3.png', 'dobrinco3.png'],
      category: 'brincos' // CATEGORIA
    },
    {
      id: '103',
      name: 'Brinco de Prata Argola Round',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '141,00',
      images: ['assets/images/brinco4.png'],
      category: 'brincos' // CATEGORIA
    },
    {
      id: '104',
      name: 'Brinco de Prata Cristal M',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '199,00',
      images: ['assets/images/brinco5.png'],
      category: 'brincos' // CATEGORIA
    },
 
    {
      id: '105',
      name: 'Brinco de Prata Ponto de Luz Cravejado',
      description: 'Ao adquirir essa joia, você recebe o seu produto em uma caixa personalizada, protegida por veludo, uma flanela de limpeza, acompanhada da nota fiscal e do cartão de garantia com os cuidados necessários para maior durabilidade da sua joia.',
      price: '147,00',
      images: ['assets/images/brinco6.png'],
      category: 'brincos' // CATEGORIA
    },
 
    // PINGENTES -----------------------------------------------------------------------------------------
 
    {
      id: '120',
      name: 'Pingente Pedra Cristal Slim Verde em Prata 925',
      description: 'O Pingente Cristal Slim Verde em prata 925 combina design moderno e simbolismo em uma peça única. Sua zircônia verde retangular, de lapidação precisa, reflete intensidade e sofisticação, transformando o pingente em um acessório cheio de personalidade.',
      price: '102,00',
      images: ['assets/images/pingente1.png', 'dopingente1.png'],
      category: 'pingentes' // CATEGORIA
    },
   
    {
      id: '123',
      name: 'Pingente de Prata Pedra Cristal Preto',
      description: 'O Pingente Pedra Cristal Preto em prata 925 é a representação perfeita de força e sofisticação. A pedra escura em zircônia lapidada reflete profundidade e poder interior, enquanto o brilho metálico da prata legítima traz equilíbrio e contraste visual. Uma peça que expressa presença e autoconfiança em cada detalhe, ideal para quem valoriza estilo e significado.',
      price: '102,00',
      images: ['assets/images/pingente4.png'],
      category: 'pingentes' // CATEGORIA
    },
    {
      id: '121',
      name: 'Pingente de Prata Pedra Cristal Slim Turquesa',
      description: 'O Pingente Cristal Slim Turquesa em prata 925 é a escolha certa para quem busca estilo discreto, mas cheio de personalidade. A pedra em zircônia turquesa, em formato retangular slim, traz cor vibrante e autenticidade, transformando o pingente em um acessório leve e inesquecível.',
      price: '102,00',
      images: ['assets/images/pingente2.png', 'dopingente2.png'],
      category: 'pingentes' // CATEGORIA
    },
    {
      id: '122',
      name: 'Pingente de Prata Pedra Cristal Slim Preto',
      description: 'O Pingente Cristal Slim Preto em prata 925 é a escolha ideal para quem busca sofisticação discreta com personalidade marcante. A zircônia preta lapidada em formato retangular slim transmite profundidade e elegância, transformando o pingente em um acessório moderno e versátil.',
      price: '102,00',
      images: ['assets/images/pingente3.png'],
      category: 'pingentes' // CATEGORIA
    },
    {
      id: '124',
      name: 'Pingente Crucifixo Médio em Prata 925',
      description: 'O Pingente Crucifixo Médio em prata 925 é a peça ideal para quem deseja unir espiritualidade e estilo em um único acessório. Com dimensões médias que equilibram presença e delicadeza, ele pode ser usado no dia a dia ou em ocasiões especiais, sempre transmitindo significado e elegância.',
      price: '85,00',
      images: ['assets/images/pingente5.png'],
      category: 'pingentes' // CATEGORIA
    },
    {
      id: '125',
      name: 'Pingente de Prata Crucifixo Cravejado Pequeno',
      description: 'O Pingente Crucifixo Cravejado Pequeno em prata 925 é uma joia delicada que une espiritualidade e elegância. Com zircônias cravejadas à mão, o crucifixo transmite devoção e proteção sem abrir mão do brilho moderno, sendo perfeito para o dia a dia ou ocasiões especiais.',
      price: '85,00',
      images: ['assets/images/pingente6.png'],
      category: 'pingentes' // CATEGORIA
    },
    {
      id: '126',
      name: 'Pingente Medalha de São Bento em Prata 925',
      description: 'O Pingente São Bento em prata 925 une espiritualidade, tradição e estilo em uma peça minimalista. Conhecido como um dos maiores símbolos de proteção da Igreja Católica, o pingente traz a medalha de São Bento em alto-relevo, marcada por detalhes precisos e significados profundos.',
      price: '59,90',
      images: ['assets/images/pingente7.png'],
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