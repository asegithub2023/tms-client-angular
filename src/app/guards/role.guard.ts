import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    // Check authentication before role authorization to keep the redirect predictable.
    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }
    if (auth.hasRole(requiredRole)) {
      return true;
    }
    return router.createUrlTree(['/unauthorized']);
  };
};