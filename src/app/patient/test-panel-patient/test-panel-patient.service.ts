import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Test } from '../../interfaces/test';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Question } from '../../interfaces/question';
import { Response } from '../../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class TestPanelPatientService {

  private loadTestList = new BehaviorSubject<void>(undefined);
  listTestLoaded$ = this.loadTestList.asObservable();


  constructor(private http: HttpClient, private router: Router) { }
  
  public getTests(limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/list-bypatient/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountTests(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/test/count-test-bypatient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getTestsByAll(data: string, limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/test-by-patient-all/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestionsByTest(id: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/test/questions/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getStateTest(id: number): Observable<Response>{
    return this.http.get<Response>(`${environment.BASE_URL}/test/state/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  emitLoadTestList() {
    this.loadTestList.next();
  }

}
