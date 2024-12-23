import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../../interfaces/group';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SizeList } from '../../interfaces/sizeList';
import { User } from '../../interfaces/user';
import { IsAuth } from '../../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class GroupPanelService {

  private loadGroupList = new BehaviorSubject<void>(undefined);
  listGroupLoaded$ = this.loadGroupList.asObservable();
  private dataGroup = new BehaviorSubject<{page: string, pageAdd: string, group: Group, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", group: {}, edit: false});
  dataGroupSent$ = this.dataGroup.asObservable();

  private dataGroupPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataGroupPanelSent$ = this.dataGroupPanel.asObservable();

  private listGroupPanel = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  listGroupPanelSent$ = this.listGroupPanel.asObservable();


  constructor(private http: HttpClient) { }
  
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

  public getCountPatientInGroup(id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/group-patient/count-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getGroupById(id: number): Observable<Group>{
    return this.http.get<Group>(`${environment.BASE_URL}/group/unique/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getMonitorById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/get-user/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
  
  public getMonitorList(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/list-doctor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveGroup(data: Group): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/group/save`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateGroup(id: number, data: Group): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/group/update/${id}`, data, {
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

  emitDataGroup(data: {page: string, pageAdd: string, group: Group, edit: boolean}) {
    this.dataGroup.next(data);
  }

  emitDataGroupPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataGroupPanel.next(data);
  }
  
  emitListGroupPanel(data: {page: string, pageAdd: string}) {
    this.listGroupPanel.next(data);
  }
  
}
