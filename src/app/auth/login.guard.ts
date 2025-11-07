import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário já está autenticado, redirecione para a home
  if (authService.isAuthenticated()) {
    console.log('Usuário já logado. Redirecionando para /home.');
    router.navigate(['/home']);
    return false; // Impede o acesso à rota de login
  }

  // Se não estiver autenticado, permita o acesso à rota de login
  return true;
};