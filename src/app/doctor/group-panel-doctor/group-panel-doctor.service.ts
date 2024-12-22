import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../../interfaces/group';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';
import { SizeList } from '../../interfaces/sizeList';
import { IsAuth } from '../../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class GroupPanelDoctorService {

  private loadGroupList = new BehaviorSubject<void>(undefined);
  listGroupLoaded$ = this.loadGroupList.asObservable();
  private loadGroups = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  groupsLoaded$ = this.loadGroups.asObservable();
  private dataGroup = new BehaviorSubject<{page: string, pageAdd: string, group: Group, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", group: {}, edit: false});
  dataGroupSent$ = this.dataGroup.asObservable();
  private dataGroupPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataGroupPanelSent$ = this.dataGroupPanel.asObservable();
  private dataPatient = new BehaviorSubject<{page: string, pageAdd: string, group: Group}>({page: "div-form-add hide", pageAdd: "page-add", group: {}});
  dataPatientSent$ = this.dataPatient.asObservable();
  private loadPatientList = new BehaviorSubject<{id: number}>({id: NaN});
  listPatientLoaded$ = this.loadPatientList.asObservable();
  

  constructor(private http: HttpClient, private router: Router) { }

  public getGroups(limit: number, page: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/groups-bymonitor/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupById(id: number): Observable<Group>{
    return this.http.get<Group>(`${environment.BASE_URL}/group/unique/${id}`, {
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

  public getCountPatientInGroup(id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/group-patient/count-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveGroup(data: Group): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/group/save-bymonitor`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateGroup(id: number, data: Group): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/group/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsByGroup(id: number, limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/doctor/list-patient-bym-g/${id}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountPatientsByGroup(id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/doctor/count-patient-bym-g/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsAndGroupByAll(id: number, data: string, limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/doctor/get-patients-bymg-byall/${id}/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public savePatient(data: User): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/doctor/save-patient-bydoctor`, data, {
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

  emitLoadGroupList() {
    this.loadGroupList.next();
  }

  emitGroups(data: {page: string, pageAdd: string}) {
    this.loadGroups.next(data);
  }

  emitDataGroup(data: {page: string, pageAdd: string, group: Group, edit: boolean}) {
    this.dataGroup.next(data);
  }

  emitDataGroupPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataGroupPanel.next(data);
  }

  emitDataPatient(data: {page: string, pageAdd: string, group: Group}) {
    this.dataPatient.next(data);
  }

  emitLoadPatientList(data: {id: number}) {
    this.loadPatientList.next(data);
  }

}
