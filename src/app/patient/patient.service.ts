import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { Group } from '../interfaces/group';
import { IsAuth } from '../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

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

  public getGroupByPatient(id: number): Observable<Group>{
    return this.http.get<Group>(`${environment.BASE_URL}/group-patient/group-by-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getMonitorById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/get-user/${id}`, {
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
