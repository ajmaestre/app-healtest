import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../../interfaces/activity';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { IsAuth } from '../../interfaces/isAuth';
import { Crucigram } from '../../interfaces/crucigram';
import { Group } from '../../interfaces/group';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ActivityPanelDoctorService {

  private loadActivityList = new BehaviorSubject<void>(undefined);
  listActivityLoaded$ = this.loadActivityList.asObservable();
  private dataActivity = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  dataActivitySent$ = this.dataActivity.asObservable();
  private dataActivityPanel = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}});
  dataActivityPanelSent$ = this.dataActivityPanel.asObservable();

  private dataCrucigrama = new BehaviorSubject<{page: string, pageAdd: string, crucigrama: Activity, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", crucigrama: {}, edit: false});
  dataCrucigramaSent$ = this.dataCrucigrama.asObservable();
  private dataSoup = new BehaviorSubject<{page: string, pageAdd: string, soup: Activity, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", soup: {}, edit: false});
  dataSoupSent$ = this.dataSoup.asObservable();
  private dataGroupAddPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataGroupAddPanelSent$ = this.dataGroupAddPanel.asObservable();
  

  constructor(private http: HttpClient) { }

  public getActivities(limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/list/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivityById(id: number): Observable<Activity>{
    return this.http.get<Activity>(`${environment.BASE_URL}/activity/get/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountActivities(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/activity/count-activity`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivitiesByAll(data: string, limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/activity-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveActivity(activity: Activity): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/activity/save`, activity, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateActivity(id: number, activity: Activity): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/activity/update/${id}`, activity, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCrucigrams(id: number): Observable<Crucigram[]>{
    return this.http.get<Crucigram[]>(`${environment.BASE_URL}/activity/cricigrams/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveGroupAct(id: number, groups: Group[]): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/activity/save-in-group`, {id, groups}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsInAct(id: number): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/activity/groups-in-act/${id}`, {
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

  emitLoadActivityList() {
    this.loadActivityList.next();
  }

  emitDataActivity(data: {page: string, pageAdd: string}) {
    this.dataActivity.next(data);
  }

  emitDataActivityPanel(data: {page: string, pageAdd: string, activity: Activity}) {
    this.dataActivityPanel.next(data);
  }

  emitDataCrucigrama(data: {page: string, pageAdd: string, crucigrama: Activity, edit: boolean}) {
    this.dataCrucigrama.next(data);
  }

  emitDataSoup(data: {page: string, pageAdd: string, soup: Activity, edit: boolean}) {
    this.dataSoup.next(data);
  }
  
  emitDataGroupAddPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataGroupAddPanel.next(data);
  }
}
