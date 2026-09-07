import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Return a UrlTree so navigation is redirected without imperatively changing state.
  if (auth.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};