import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.css']
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  
  // ▼▼▼ É AQUI QUE VOCÊ ADICIONA MAIS IMAGENS ▼▼▼
  slides = [
    { 
      imageUrl: 'assets/images/Banner.png', 
      altText: 'Modelo usando joias masculinas' 
    },
    // Exemplo de como adicionar mais slides:
    { 
      imageUrl: 'assets/images/Banner black friday.png', 
      altText: 'Destaque para correntes de prata' 
    },
    { 
      imageUrl: 'assets/images/Pulseiras.png', 
      altText: 'Pulseira masculina no pulso' 
    }
  ];

  currentIndex = 0;
  currentTransform = 0;
  private intervalId: any;

  ngOnInit(): void {
    // Inicia a troca automática de slides
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    // Limpa o temporizador para evitar problemas de memória
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 1); // Muda de slide a cada 5 segundos
  }

  updateSlideTransform(): void {
    this.currentTransform = -this.currentIndex * 100;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlideTransform();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlideTransform();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateSlideTransform();
  }
}