import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../../interfaces/group';
import { environment } from '../../../environments/environment';
import { Resourse } from '../../interfaces/resourse';
import { SizeList } from '../../interfaces/sizeList';
import { IsAuth } from '../../interfaces/isAuth';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ResoursePanelDoctorService {

  private dataGroupAddPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN, edit: false});
  dataGroupAddPanelSent$ = this.dataGroupAddPanel.asObservable();

  private loadResourseList = new BehaviorSubject<void>(undefined);
  listResourseLoaded$ = this.loadResourseList.asObservable();
  private loadGroupList = new BehaviorSubject<void>(undefined);
  listGroupLoaded$ = this.loadGroupList.asObservable();
  private loadResourses = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  resoursesLoaded$ = this.loadResourses.asObservable();
  private dataResourse = new BehaviorSubject<{page: string, pageAdd: string, resourse: Resourse, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", resourse: {}, edit: false});
  dataResourseSent$ = this.dataResourse.asObservable();
  private dataResoursePanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataResoursePanelSent$ = this.dataResoursePanel.asObservable();


  constructor(private http: HttpClient, private router: Router) { }

  public getGroupsByRes(id: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/resourse/get-groups/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveGroupResourse(id: number, groups: Group[]): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/resourse/save-in-group`, {id, groups}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsInRes(id: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/resourse/groups-in-res/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroups(limit: number, page: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/groups-bymonitor/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountGroups(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/group/count-groups-bymonitor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsByAll(data: string, limit: number, page: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/groups-bymonitor-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResourses(limit: number, page: number): Observable<Resourse[]>{
    return this.http.get<Resourse[]>(`${environment.BASE_URL}/resourse/list/${limit}/${page}`, {
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

  public getCountResourses(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/resourse/count-resourse`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResoursesByAll(data: string, limit: number, page: number): Observable<Resourse[]>{
    return this.http.get<Resourse[]>(`${environment.BASE_URL}/resourse/resourse-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveResourse(resourse: Resourse): Observable<IsAuth>{
    const formData = new FormData();
    if(resourse.name && resourse.type && resourse.realtype && resourse.description && resourse.file){
      formData.append('name', resourse.name);
      formData.append('type', resourse.type);
      formData.append('realtype', resourse.realtype);
      formData.append('description', resourse.description);
      formData.append('data', resourse.file); 
    }
    return this.http.post<IsAuth>(`${environment.BASE_URL}/resourse/save`, formData, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateResourse(id: number, resourse: Resourse): Observable<IsAuth>{
    const formData = new FormData();
    if(resourse.name && resourse.type && resourse.realtype && resourse.description){
      formData.append('name', resourse.name);
      formData.append('type', resourse.type);
      formData.append('realtype', resourse.realtype);
      formData.append('description', resourse.description);
      if(resourse.file){
        formData.append('data', resourse.file); 
      }
    }
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/resourse/update/${id}`, formData, {
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

  emitLoadResourseList() {
    this.loadResourseList.next();
  }

  emitLoadGroupList() {
    this.loadGroupList.next();
  }

  emitResourses(data: {page: string, pageAdd: string}) {
    this.loadResourses.next(data);
  }

  emitDataResourse(data: {page: string, pageAdd: string, resourse: Resourse, edit: boolean}) {
    this.dataResourse.next(data);
  }

  emitDataResoursePanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataResoursePanel.next(data);
  }

  emitDataGroupAddPanel(data: {page: string, pageAdd: string, id: number, edit: boolean}) {
    this.dataGroupAddPanel.next(data);
  }

}
