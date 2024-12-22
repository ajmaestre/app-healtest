import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Group } from '../../interfaces/group';
import { IsAuth } from '../../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class DoctorPanelService {

  private loadDoctorList = new BehaviorSubject<void>(undefined);
  listDoctorLoaded$ = this.loadDoctorList.asObservable();
  private dataDoctor = new BehaviorSubject<{page: string, pageAdd: string, user: User, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", user: {}, edit: false});
  dataDoctorSent$ = this.dataDoctor.asObservable();

  private dataMonitorPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataMonitorPanelSent$ = this.dataMonitorPanel.asObservable();
  private monitorListPanel = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  monitorListPanelSent$ = this.monitorListPanel.asObservable();


  constructor(private http: HttpClient) { }

  public getMonitors(limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/list-doctor/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountMonitors(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/user/count-doctor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getDoctorsByAll(data: string, limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/get-doctors-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsByMonitor(id: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/get-groups-bymonitor/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/unique/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveDoctor(data: User): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/user/save-doctor`, data, {
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

  emitLoadDoctorList() {
    this.loadDoctorList.next();
  }

  emitDataDoctor(data: {page: string, pageAdd: string, user: User, edit: boolean}) {
    this.dataDoctor.next(data);
  }

  emitDataMonitorPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataMonitorPanel.next(data);
  }

  emitMonitorListPanel(data: {page: string, pageAdd: string}) {
    this.monitorListPanel.next(data);
  }

}
