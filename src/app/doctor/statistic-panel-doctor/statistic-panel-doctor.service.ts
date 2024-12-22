import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { stateCount } from '../../interfaces/responseInterface';
import { environment } from '../../../environments/environment';
import * as Highcharts from 'highcharts';


@Injectable({
  providedIn: 'root'
})
export class StatisticPanelDoctorService {

  private loadStatList = new BehaviorSubject<void>(undefined);
  listStatLoaded$ = this.loadStatList.asObservable();

  private dataStat = new BehaviorSubject<{page: string, pageAdd: string, graphConfig: Highcharts.Options}>({page: "div-form-add hide", pageAdd: "page-add", graphConfig: {}});
  dataStatSent$ = this.dataStat.asObservable();

  constructor(private http: HttpClient) { }
  
  public getStatsGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/state-bydoctor-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/patient-bydoctor-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTestsGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/test-bydoctor-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getResoursesGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/resourse-bydoctor-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResoursesTypeGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/resourse-bytype-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsByMonthGraph(): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/patient-bymonth-graph`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  emitLoadStatList() {
    this.loadStatList.next();
  }
  
  emitDataStat(data: {page: string, pageAdd: string, graphConfig: Highcharts.Options}) {
    this.dataStat.next(data);
  }

}
