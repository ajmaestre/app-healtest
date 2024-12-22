import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsAuth } from '../interfaces/isAuth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordPanelService {

  private dataPassword = new BehaviorSubject<{page: string, pageAdd: string, id: number, own: boolean}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN, own: false});
  dataPassword$ = this.dataPassword.asObservable();


  constructor(private http: HttpClient) { }
  
  emitDataPassword(data: {page: string, pageAdd: string, id: number, own: boolean}){
    this.dataPassword.next(data);
  }

  public changePassword(password_new: string, password_old: string): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update-password`, {password_new, password_old}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public changePasswordAdmin(id: number, password_new: string): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update-password-admin/${id}`, {password_new}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

}
