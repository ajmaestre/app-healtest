import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Test } from '../../interfaces/test';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Question } from '../../interfaces/question';
import { IsAuth } from '../../interfaces/isAuth';
import { Option } from '../../interfaces/option';
import { Group } from '../../interfaces/group';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TestPanelDoctorService {

  private loadTestList = new BehaviorSubject<void>(undefined);
  listTestLoaded$ = this.loadTestList.asObservable();
  private testsList = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  testsLoaded$ = this.testsList.asObservable();
  private dataTest = new BehaviorSubject<{page: string, pageAdd: string, test: Test, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", test: {}, edit: false});
  dataTestSent$ = this.dataTest.asObservable();
  private dataTestPanel = new BehaviorSubject<{page: string, pageAdd: string, test: Test}>({page: "div-form-add hide", pageAdd: "page-add", test: {}});
  dataTestPanelSent$ = this.dataTestPanel.asObservable();

  private dataGroupAddPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN, edit: false});
  dataGroupAddPanelSent$ = this.dataGroupAddPanel.asObservable();


  constructor(private http: HttpClient, private router: Router) { }
  
  public getTests(limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/list/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountTests(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/test/count-test`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTestsByAll(data: string, limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/test-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestionsByTest(id: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/test/questions/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveTest(test: Test): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/test/save`, test, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateTest(id: number, test: Test): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/test/update/${id}`, test, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestions(limit: number, page: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/question/list/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountQuestions(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/question/count-question`, {
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

  public saveGroupTest(id: number, groups: Group[]): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/test/save-in-group`, {id, groups}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsInTest(id: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/test/groups-in-test/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getProfile(): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/profile-user`, {
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

  emitTests(data: {page: string, pageAdd: string}) {
    this.testsList.next(data);
  }

  emitDataTest(data: {page: string, pageAdd: string, test: Test, edit: boolean}) {
    this.dataTest.next(data);
  }

  emitDataTestPanel(data: {page: string, pageAdd: string, test: Test}) {
    this.dataTestPanel.next(data);
  }

  emitDataGroupAddPanel(data: {page: string, pageAdd: string, id: number, edit: boolean}) {
    this.dataGroupAddPanel.next(data);
  }

}
