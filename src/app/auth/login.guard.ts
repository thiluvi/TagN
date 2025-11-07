import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.currentUserRole();
    
    // Se já está logado...
    if (role === 'admin') {
      console.log('Admin já logado. Redirecionando para /admin.');
      router.navigate(['/admin']); // Admin vai para /admin
    } else {
      console.log('Usuário já logado. Redirecionando para /home.');
      router.navigate(['/home']); // User vai para /home
    }
    return false; // Impede o acesso à rota de login
  }

  // Se não estiver autenticado, permita o acesso à rota de login
  return true;
};