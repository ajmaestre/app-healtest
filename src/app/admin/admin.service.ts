import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { IsAuth } from '../interfaces/isAuth';
import { SizeList } from '../interfaces/sizeList';
import { Group } from '../interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private loadPerfil = new BehaviorSubject<void>(undefined);
  loadedPerfil$ = this.loadPerfil.asObservable();

  private loadGroupList = new BehaviorSubject<void>(undefined);
  listGroupLoaded$ = this.loadGroupList.asObservable();
  private dataGroup = new BehaviorSubject<{page: string, pageAdd: string, group: Group, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", group: {}, edit: false});
  dataGroupSent$ = this.dataGroup.asObservable();

  private dataGroupPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataGroupPanelSent$ = this.dataGroupPanel.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  emitLoadPerfil() {
    this.loadPerfil.next();
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

  public getMonitorList(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/user/list-doctor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteUser(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/user/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getProfile(): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/profile-user`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  // --------------------------------------------------------------------------------------

  public saveGroup(data: Group): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/group/save`, data, {
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

  public updateGroup(id: number, data: Group): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/group/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public deleteGroup(id: number): Observable<IsAuth>{
    return this.http.delete<IsAuth>(`${environment.BASE_URL}/group/delete/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getMonitorById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/get-user/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  // --------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------

  public updateUser(id: number, data: User): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  public closeSession(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
