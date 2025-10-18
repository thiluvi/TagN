import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './topbar/topbar';
import { Footer } from './footer/footer';
import { HeroBannerComponent } from './hero-banner/hero-banner';
import { InfoStrip } from './info-strip/info-strip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar, Footer, HeroBannerComponent, InfoStrip],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TagN');
}
