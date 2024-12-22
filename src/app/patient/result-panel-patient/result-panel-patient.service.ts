import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Test } from '../../interfaces/test';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Question } from '../../interfaces/question';
import { Response } from '../../interfaces/response';
import { Option } from '../../interfaces/option';
import { TestResponse } from '../../interfaces/testResponse';

@Injectable({
  providedIn: 'root'
})
export class ResultPanelPatientService {

  private loadResultList = new BehaviorSubject<void>(undefined);
  listResultLoaded$ = this.loadResultList.asObservable();
  private dataResultPanel = new BehaviorSubject<{page: string, pageAdd: string, test: Test}>({page: "div-form-add hide", pageAdd: "page-add", test: {}});
  dataResultPanelSent$ = this.dataResultPanel.asObservable();


  constructor(private http: HttpClient) { }
  
  public getResults(limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/result/result-bypatient/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponses(test_id: number): Observable<TestResponse[]>{
    return this.http.get<TestResponse[]>(`${environment.BASE_URL}/result/list-result/${test_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountResults(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/result/count-result-bypatient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getResultsByAll(data: string, limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/result/result-by-patient-all/${data}/${limit}/${page}`, {
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

  emitLoadResultList() {
    this.loadResultList.next();
  }

  emitDataResultPanel(data: {page: string, pageAdd: string, test: Test}) {
    this.dataResultPanel.next(data);
  }

}
