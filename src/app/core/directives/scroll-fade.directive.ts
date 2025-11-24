import { Directive, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollFade]',
  standalone: true, // Diretiva standalone
})
export class ScrollFadeDirective implements OnInit, OnDestroy {
  
  private elementRef = inject(ElementRef);
  private observer: IntersectionObserver | undefined;

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Se o elemento está visível (intersectando)
          if (entry.isIntersecting) {
            // Adiciona a classe que criamos no CSS
            element.classList.add('is-visible');
            
            // (Opcional) Para de observar o elemento depois que ele já apareceu
            this.observer?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.2, // Dispara quando 10% do elemento estiver visível
      }
    );

    // Inicia a observação do elemento
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    // Limpa o observer quando o elemento é destruído
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}