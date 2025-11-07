import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário está autenticado, permita o acesso
  if (authService.isAuthenticated()) {
    return true;
  }

  // Se não estiver autenticado, redirecione para o login (rota raiz '')
  console.log('Acesso bloqueado por AuthGuard. Redirecionando para login.');
  router.navigate(['']);
  return false;
};