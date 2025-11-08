import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 1. Importe o RouterModule

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterModule], // 2. Adicione o RouterModule aqui
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

}