import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resourse } from '../../interfaces/resourse';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';

@Injectable({
  providedIn: 'root'
})
export class ResoursePanelPatientService {

  private loadResourseList = new BehaviorSubject<void>(undefined);
  listResourseLoaded$ = this.loadResourseList.asObservable();
  private dataResoursePanel = new BehaviorSubject<{page: string, pageAdd: string, resourse: Resourse}>({page: "div-form-add hide", pageAdd: "page-add", resourse: {}});
  dataResoursePanelSent$ = this.dataResoursePanel.asObservable();


  constructor(private http: HttpClient, private router: Router) { }

  public getResourses(limit: number, page: number): Observable<Resourse[]>{
    return this.http.get<Resourse[]>(`${environment.BASE_URL}/resourse/list-bypatient/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountResourses(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/resourse/count-resourse-bypatient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResoursesByAll(data: string, limit: number, page: number): Observable<Resourse[]>{
    return this.http.get<Resourse[]>(`${environment.BASE_URL}/resourse/resourse-by-patient-all/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResourse(id: number): Observable<Blob>{
    return this.http.get(`${environment.BASE_URL}/resourse/get/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getDataResourse(id: number): Observable<Resourse>{
    return this.http.get<Resourse>(`${environment.BASE_URL}/resourse/get-data/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  emitLoadResourseList() {
    this.loadResourseList.next();
  }

  emitDataResoursePanel(data: {page: string, pageAdd: string, resourse: Resourse}) {
    this.dataResoursePanel.next(data);
  }

}
