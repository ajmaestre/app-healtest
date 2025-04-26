import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Group } from '../../interfaces/group';
import { IsAuth } from '../../interfaces/isAuth';
import { Test } from '../../interfaces/test';
import { Question } from '../../interfaces/question';
import { Option } from '../../interfaces/option';
import { TestResponse } from '../../interfaces/testResponse';
import { Response } from '../../interfaces/response';
import { Activity } from '../../interfaces/activity';
import { Crucigram } from '../../interfaces/crucigram';
import { Task } from '../../interfaces/task';
import { Resourse } from '../../interfaces/resourse';
import { stateCount } from '../../interfaces/responseInterface';

@Injectable({
  providedIn: 'root'
})
export class PatientPanelDoctorService {

  private loadPatientList = new BehaviorSubject<void>(undefined);
  listPatientLoaded$ = this.loadPatientList.asObservable();
  private dataPatient = new BehaviorSubject<{page: string, pageAdd: string, user: User, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", user: {}, edit: false});
  dataPatientSent$ = this.dataPatient.asObservable();
  private loadPatients = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  patientsLoaded$ = this.loadPatients.asObservable();

  private loadPatientPanel = new BehaviorSubject<number>(NaN);
  loadedPatientPanel$ = this.loadPatientPanel.asObservable();
  private dataPatientPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN});
  dataPatientPanelSent$ = this.dataPatientPanel.asObservable();
  private dataGroupAddPanel = new BehaviorSubject<{page: string, pageAdd: string, id: number, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", id: NaN, edit: false});
  dataGroupAddPanelSent$ = this.dataGroupAddPanel.asObservable();

  private dataTestPanel = new BehaviorSubject<{page: string, pageAdd: string, test: Test, idUser: number}>({page: "div-form-add hide", pageAdd: "page-add", test: {}, idUser: NaN});
  dataTestPanelSent$ = this.dataTestPanel.asObservable();
  private dataActPanel = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity, idUser: number}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}, idUser: NaN});
  dataActPanelSent$ = this.dataActPanel.asObservable();
  private dataSoupPanel = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity, idUser: number}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}, idUser: NaN});
  dataSoupPanelSent$ = this.dataSoupPanel.asObservable();

  private dataTaskPanel = new BehaviorSubject<{page: string, pageAdd: string, activity: Activity, idUser: number}>({page: "div-form-add hide", pageAdd: "page-add", activity: {}, idUser: NaN});
  dataTaskPanelSent$ = this.dataTaskPanel.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
  
  public getPatients(limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/doctor/list-patient-bymonitor/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountPatients(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/doctor/count-patient-bymonitor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getPatientsByAll(data: string, limit: number, page: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BASE_URL}/doctor/get-patients-bymonitor-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupsByMonitor(): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.BASE_URL}/group/list-groups-bymonitor`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public savePatient(data: User): Observable<IsAuth>{
    return this.http.post<IsAuth>(`${environment.BASE_URL}/doctor/save-patient-bydoctor`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateUser(id: number, data: User): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/user/update/${id}`, data, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getGroupByPatient(id: number): Observable<Group>{
    return this.http.get<Group>(`${environment.BASE_URL}/group-patient/group-by-patient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateGroupPatient(id: number, group_id: number): Observable<IsAuth>{
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/group-patient/update/${id}`, {group_id}, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/unique/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getMonitorById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/get-user/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTests(id:number, limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/list-bypd/${id}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountTests(id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/test/count-test-bypd/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTestsByAll(id: number, data: string, limit: number, page: number): Observable<Test[]>{
    return this.http.get<Test[]>(`${environment.BASE_URL}/test/test-bypd-all/${id}/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestionsByTest(id: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/test/questions/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getOptionsByQuestion(id: number): Observable<Option[]>{
    return this.http.get<Option[]>(`${environment.BASE_URL}/question/options/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestion(id: number): Observable<Blob>{
    return this.http.get(`${environment.BASE_URL}/question/get/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTasks(id: number): Observable<Task>{
    return this.http.get<Task>(`${environment.BASE_URL}/activity/tasks/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponses(user_id: number, test_id: number): Observable<TestResponse[]>{
    return this.http.get<TestResponse[]>(`${environment.BASE_URL}/result/list-result-bydoctor/${user_id}/${test_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponseList(user_id: number, activity_id: number): Observable<Crucigram[]>{
    return this.http.get<Crucigram[]>(`${environment.BASE_URL}/activity/cricigrams-bydoctor/${user_id}/${activity_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponseTask(user_id: number, activity_id: number): Observable<Blob>{
    return this.http.get(`${environment.BASE_URL}/activity/tasks-bydoctor/${user_id}/${activity_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getResponseTaskData(user_id: number, activity_id: number): Observable<Resourse>{
    return this.http.get<Resourse>(`${environment.BASE_URL}/activity/tasks-data-bydoctor/${user_id}/${activity_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCrucigrams(id: number): Observable<Crucigram[]>{
    return this.http.get<Crucigram[]>(`${environment.BASE_URL}/activity/cricigrams/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getStateTest(idUser: number, idTest: number): Observable<Response>{
    return this.http.get<Response>(`${environment.BASE_URL}/test/state-bydoctor/${idUser}/${idTest}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getDateResult(idUser: number, idTest: number): Observable<Date>{
    return this.http.get<Date>(`${environment.BASE_URL}/result/date-bydoctor/${idUser}/${idTest}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivities(user_id: number, limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/list-bydoctor/${user_id}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivityById(id: number): Observable<Activity>{
    return this.http.get<Activity>(`${environment.BASE_URL}/activity/get/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountActivities(user_id: number): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/activity/count-activity-bydoctor/${user_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActivitiesByAll(user_id: number, data: string, limit: number, page: number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${environment.BASE_URL}/activity/activity-by-doctor-all/${user_id}/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getStateActivity(user_id: number, activity_id: number): Observable<Response>{
    return this.http.get<Response>(`${environment.BASE_URL}/activity/state-bydoctor/${user_id}/${activity_id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getProfile(): Observable<User>{
    return this.http.get<User>(`${environment.BASE_URL}/user/profile-user`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
  
  public getTestByPatient(id: number): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/test-bypatient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getActByPatient(id: number): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/act-bypatient/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getTypeActByPatient(id: number): Observable<stateCount[]>{
    return this.http.get<stateCount[]>(`${environment.BASE_URL}/stat/act-type-bypatient/${id}`, {
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

  emitPatients(data: {page: string, pageAdd: string}) {
    this.loadPatients.next(data);
  }

  emitDataPatient(data: {page: string, pageAdd: string, user: User, edit: boolean}) {
    this.dataPatient.next(data);
  }

  emitDataPatientPanel(data: {page: string, pageAdd: string, id: number}) {
    this.dataPatientPanel.next(data);
  }

  emitLoadPatientListPanel(id: number) {
    this.loadPatientPanel.next(id);
  }

  emitDataGroupAddPanel(data: {page: string, pageAdd: string, id: number, edit: boolean}) {
    this.dataGroupAddPanel.next(data);
  }

  emitDataTestPanel(data: {page: string, pageAdd: string, test: Test, idUser: number}) {
    this.dataTestPanel.next(data);
  }

  emitDataActPanel(data: {page: string, pageAdd: string, activity: Activity, idUser: number}) {
    this.dataActPanel.next(data);
  }

  emitDataSoupPanel(data: {page: string, pageAdd: string, activity: Activity, idUser: number}) {
    this.dataSoupPanel.next(data);
  }

  emitDataTaskPanel(data: {page: string, pageAdd: string, activity: Activity, idUser: number}) {
    this.dataTaskPanel.next(data);
  }

}
