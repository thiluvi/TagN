import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.css']
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  
  slides = [
    { 
      imageUrl: 'assets/images/Banner.png', 
      altText: 'Modelo usando joias masculinas' 
    },
    { 
      imageUrl: 'assets/images/Banner black friday.png', 
      altText: 'Banner da Black Friday' 
    },
    { 
      imageUrl: 'assets/images/Banner 3 slide.jpg',
      altText: 'Banner 3 slide' 
    }
  ];

  currentIndex = 0;
  currentTransform = 0;
  private intervalId: any;

  // 1. Injetar o ChangeDetectorRef
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
      
      // 2. Dizer ao Angular para detetar as alterações
      this.cdr.detectChanges(); 
      
    }, 7000); // Muda de slide a cada 7 segundos
  }

  updateSlideTransform(): void {
    this.currentTransform = -this.currentIndex * 100;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlideTransform();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateSlideTransform();

    // 3. Detetar alterações também quando o utilizador clica nos pontos
    this.cdr.detectChanges();
  }
}