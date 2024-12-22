import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { IsAuth } from '../../interfaces/isAuth';
import { Group } from '../../interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class PatientPanelService {

  private loadPatientList = new BehaviorSubject<void>(undefined);
  listPatientLoaded$ = this.loadPatientList.asObservable();
  private dataPastient = new BehaviorSubject<{page: string, pageAdd: string, user: User, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", user: {}, edit: false});
  dataPatientSent$ = this.dataPastient.asObservable();
  private pastientListPanel = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  patientListPanelSent$ = this.pastientListPanel.asObservable();

  private loadPatientPanel = new BehaviorSubject<number>(NaN);
  loadedPatientPanel$ = this.loadPatientPanel.asObservable();
  private dataPatientPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataPatientPanelSent$ = this.dataPatientPanel.asObservable();
  private dataGroupAddPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN, edit: false});
  dataGroupAddPanelSent$ = this.dataGroupAddPanel.asObservable();
  private dataGroupPanel = new BehaviorSubject<{page: string, pageAdd: string, group: Group}>({page: "div-form-add hide", pageAdd: "page-add", group: {}});
  dataGroupPanelSent$ = this.dataGroupPanel.asObservable();

  constructor(private http: HttpClient) { }

  public getPatients(limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/list-patient/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountPatients(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/user/count-patient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/unique/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateUser(id: number, data: User): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsByAll(data: string, limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/get-patients-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getMonitorById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/get-user/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupByPatient(id: number): Observable<Group>{
    return this.http.get<Group>(`${environment.BASE_URL}/group-patient/group-by-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public savePatient(data: User): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/user/save-patient`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveGroupPatient(group_id: number, paciente_id: number): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/group-patient/save`, {group_id, paciente_id}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateGroupPatient(id: number, group_id: number): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/group-patient/update/${id}`, {group_id}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountPatientInGroup(id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/group-patient/count-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getGroups(limit: number, page: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/list/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountGroups(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/group/count`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsByAll(data: string, limit: number, page: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/get-groups-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  emitLoadPatientList() {
    this.loadPatientList.next();
  }

  emitDataPatient(data: {page: string, pageAdd: string, user: User, edit: boolean}) {
    this.dataPastient.next(data);
  }

  emitPatientListPanel(data: {page: string, pageAdd: string}) {
    this.pastientListPanel.next(data);
  }

  emitLoadPatientListPanel(id: number) {
    this.loadPatientPanel.next(id);
  }

  emitDataPatientPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataPatientPanel.next(data);
  }

  emitDataGroupAddPanel(data: {page: string, pageAdd: string, id: number, edit: boolean}) {
    this.dataGroupAddPanel.next(data);
  }

  emitDataGroupPanel(data: {page: string, pageAdd: string, group: Group}) {
    this.dataGroupPanel.next(data);
  }

}
