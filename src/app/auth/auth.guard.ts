import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { catchError, map, of } from "rxjs";


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isAuth().pipe(
    map((isAuth) => {
      if(!isAuth){
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
