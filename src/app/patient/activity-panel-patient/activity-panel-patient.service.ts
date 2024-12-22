import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../../interfaces/activity';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { User } from '../../interfaces/user';
import { Response } from '../../interfaces/response';
import { IsAuth } from '../../interfaces/isAuth';
import { Crucigram } from '../../interfaces/crucigram';

@Injectable({
  providedIn: 'root'
})
export class ActivityPanelPatientService {

  private loadActivityList = new BehaviorSubject<void>(undefined);
  listActivityLoaded$ = this.loadActivityList.asObservable();
  private dataActivityPanel = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}});
  dataActivityPanelSent$ = this.dataActivityPanel.asObservable();
  private dataActivity = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}});
  dataActivitySent$ = this.dataActivity.asObservable();
  private dataActivitySoup = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}});
  dataActivitySoupSent$ = this.dataActivitySoup.asObservable();


  constructor(private http: HttpClient) { }

  public getActivities(limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/list-bypatient/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivityById(id: number): Observable<Activity>{
    return this.http.get<Activity>(`${environment.BASE_URL}/activity/get/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountActivities(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/activity/count-activity-bypatient`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivitiesByAll(data: string, limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/activity-by-patient-all/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getStateActivity(id: number): Observable<Response>{
    return this.http.get<Response>(`${environment.BASE_URL}/activity/state/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveActivityResponse(activity: Activity): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/activity/save-response`, activity, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCrucigrams(id: number): Observable<Crucigram[]>{
    return this.http.get<Crucigram[]>(`${environment.BASE_URL}/activity/cricigrams-by-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponses(id: number): Observable<Crucigram[]>{
    return this.http.get<Crucigram[]>(`${environment.BASE_URL}/activity/cricigrams-response/${id}`, {
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

  emitDataActivityPanel(data: {page: string, pageAdd: string, activity: Activity}) {
    this.dataActivityPanel.next(data);
  }
  
  emitDataActivity(data: {page: string, pageAdd: string, activity: Activity}) {
    this.dataActivity.next(data);
  }

  emitDataActivitySoup(data: {page: string, pageAdd: string, activity: Activity}) {
    this.dataActivitySoup.next(data);
  }

}
