import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../interfaces/session';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Token } from '../../interfaces/token';
import { environment } from '../../../environments/environment';
import { IsAuth } from '../../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router, private http: HttpClient) { }

  public getSession(session: Session): Observable<Token>{
    return this.http.post<Token>(`${environment.BASE_URL}/user/login`, session);
  }

  public isAdmin(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/user/is-admin`, {
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

  public isDoctor(): Observable<boolean>{
    return this.http.get<IsAuth>(`${environment.BASE_URL}/doctor/is-doctor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    }).pipe(
      map((res: IsAuth) => res.response),
      catchError(() => of(false))
    );
  }

  public setToken(tkn: string){
    localStorage.setItem('tkn', tkn);
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

}
