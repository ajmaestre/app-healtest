import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isAdmin().pipe(
    map((isAdmin) => {
      if(!isAdmin){
        router.navigate(["/"]);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(["/"]);
      return of(false);
    })
  );
};
