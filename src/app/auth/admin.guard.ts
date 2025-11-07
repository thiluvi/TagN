import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado E se a role é 'admin'
  if (authService.isAuthenticated() && authService.currentUserRole() === 'admin') {
    return true; // Permite acesso
  }

  // Se não for admin, redireciona
  if (authService.isAuthenticated()) {
    console.log('Acesso negado. Usuário não é admin. Redirecionando para /home.');
    router.navigate(['/home']); // Logado, mas não é admin
  } else {
    console.log('Acesso negado. Usuário não logado. Redirecionando para /.');
    router.navigate(['']); // Não está logado
  }
  
  return false;
};