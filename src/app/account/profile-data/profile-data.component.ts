import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.css'
})
export class ProfileDataComponent {
  private authService = inject(AuthService);
  
  // A correção é simplesmente usar o signal público que criamos no AuthService
  user = this.authService.currentUser; 
}