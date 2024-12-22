import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { IsAuth } from '../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
 
  private loadPerfil = new BehaviorSubject<void>(undefined);
  loadedPerfil$ = this.loadPerfil.asObservable();


  constructor(private http: HttpClient, private router: Router) { }
  
  public getProfile(): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/profile-user`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateUser(id: number, data: User): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  public closeSession(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

  emitLoadPerfil() {
    this.loadPerfil.next();
  }
  
}
