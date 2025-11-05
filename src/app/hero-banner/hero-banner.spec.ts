import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.css']
})
export class HeroBannerComponent {
  // Apenas a imagem principal do banner
  bannerImage = 'assets/images/Banner.png';
  bannerAltText = 'Modelo usando joias masculinas';
}