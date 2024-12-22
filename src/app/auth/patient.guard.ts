import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const patientGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isPatient().pipe(
    map((isPatient) => {
      if(!isPatient){
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
