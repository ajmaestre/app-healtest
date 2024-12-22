import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsAuth } from '../interfaces/isAuth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PanelConfirmService {

  private loadDoctorList = new BehaviorSubject<void>(undefined);
  listDoctorLoaded$ = this.loadDoctorList.asObservable();

  private loadPatientList = new BehaviorSubject<void>(undefined);
  listPatientLoaded$ = this.loadPatientList.asObservable();

  private loadGroupList = new BehaviorSubject<void>(undefined);
  listGroupLoaded$ = this.loadGroupList.asObservable();

  private loadResourseList = new BehaviorSubject<void>(undefined);
  listResourseLoaded$ = this.loadResourseList.asObservable();

  private loadQuestionList = new BehaviorSubject<void>(undefined);
  listQuestionLoaded$ = this.loadQuestionList.asObservable();

  private loadTestList = new BehaviorSubject<void>(undefined);
  listTestLoaded$ = this.loadTestList.asObservable();

  private loadActivityList = new BehaviorSubject<void>(undefined);
  listActivityLoaded$ = this.loadActivityList.asObservable();


  constructor(private http: HttpClient, private router: Router) { }

  emitLoadDoctorList() {
    this.loadDoctorList.next();
  }

  emitLoadPatientList() {
    this.loadPatientList.next();
  }

  emitLoadGroupList() {
    this.loadGroupList.next();
  }

  emitLoadResourseList() {
    this.loadResourseList.next();
  }

  emitLoadQuestionList() {
    this.loadQuestionList.next();
  }

  emitLoadTestList() {
    this.loadTestList.next();
  }

  emitLoadActivityList() {
    this.loadActivityList.next();
  }

  public deleteUser(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/user/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteGroup(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/group/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteResourse(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/resourse/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteQuestion(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/question/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteTest(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/test/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteActivity(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/activity/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

}
