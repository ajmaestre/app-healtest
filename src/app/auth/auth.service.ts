import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { IsAuth } from '../interfaces/isAuth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  public isAuth(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/user/is-auth`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    }).pipe(
      map((res: IsAuth) => res.response),
      catchError(() => of(false))
    );
  }

  public isAdmin(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/user/is-admin`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    }).pipe(
      map((res: IsAuth) => res.response),
      catchError(() => of(false))
    );
  }

  public isDoctor(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/doctor/is-doctor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    }).pipe(
      map((res: IsAuth) => res.response),
      catchError(() => of(false))
    );
  }

  public isPatient(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/user/is-patient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    }).pipe(
      map((res: IsAuth) => res.response),
      catchError(() => of(false))
    );
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

}
