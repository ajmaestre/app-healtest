import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { Group } from '../interfaces/group';
import { Test } from '../interfaces/test';
import { Option } from '../interfaces/option';
import { Response } from '../interfaces/response';
import { TestResponse } from '../interfaces/testResponse';
import { IsAuth } from '../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class TestingPanelPatientService {

  private loadData = new BehaviorSubject<{test: Test}>({test: {}});
  loadedData$ = this.loadData.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
  
  public getProfile(): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/profile-user`, {
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

  public getQuestion(id: number): Observable<Blob>{
    return this.http.get(`${environment.BASE_URL}/question/get/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
  
  public getOptionsByQuestion(id: number): Observable<Option[]>{
    return this.http.get<Option[]>(`${environment.BASE_URL}/question/options/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getStateTest(id: number): Observable<Response>{
    return this.http.get<Response>(`${environment.BASE_URL}/test/state/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveResponseTest(responses: TestResponse[]): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/result/save-response`, {responses}, {
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

  emitLoadData(data: {test: Test}) {
    this.loadData.next(data);
  }

}
