import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question } from '../../interfaces/question';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SizeList } from '../../interfaces/sizeList';
import { Option } from '../../interfaces/option';
import { IsAuth } from '../../interfaces/isAuth';

@Injectable({
  providedIn: 'root'
})
export class QuestionPanelDoctorService {

  private loadQuestionList = new BehaviorSubject<void>(undefined);
  listQuestionLoaded$ = this.loadQuestionList.asObservable();
  private questionsList = new BehaviorSubject<{page: string, pageAdd: string}>({page: "div-form-add hide", pageAdd: "page-add"});
  questionsLoaded$ = this.questionsList.asObservable();
  private dataQuestion = new BehaviorSubject<{page: string, pageAdd: string, question: Question, edit: boolean}>({page: "div-form-add hide", pageAdd: "page-add", question: {}, edit: false});
  dataQuestionSent$ = this.dataQuestion.asObservable();
  private dataQuestionPanel = new BehaviorSubject<{page: string, pageAdd: string, question: Question}>({page: "div-form-add hide", pageAdd: "page-add", question: {}});
  dataQuestionPanelSent$ = this.dataQuestionPanel.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public getQuestions(limit: number, page: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/question/list/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestion(id: number): Observable<Blob>{
    return this.http.get(`${environment.BASE_URL}/question/get/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getCountQuestions(): Observable<SizeList>{
    return this.http.get<SizeList>(`${environment.BASE_URL}/question/count-question`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getOptionsByQuestion(id: number): Observable<Option[]>{
    return this.http.get<Option[]>(`${environment.BASE_URL}/question/options/${id}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public getQuestionsByAll(data: string, limit: number, page: number): Observable<Question[]>{
    return this.http.get<Question[]>(`${environment.BASE_URL}/question/question-byall/${data}/${limit}/${page}`, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public saveQuestion(question: Question): Observable<IsAuth>{
    const formData = new FormData();
    if(question.question && question.keyword && question.realtype && question.file && question.options && question.options?.length){
      formData.append('question', question.question);
      formData.append('keyword', question.keyword);
      formData.append('realtype', question.realtype);
      formData.append('options', JSON.stringify(question.options));
      formData.append('data', question.file); 
    }
    return this.http.post<IsAuth>(`${environment.BASE_URL}/question/save`, formData, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }

  public updateQuestion(id: number, question: Question): Observable<IsAuth>{
    const formData = new FormData();
    if(question.question && question.keyword && question.realtype && question.options && question.options?.length){
      formData.append('question', question.question);
      formData.append('keyword', question.keyword);
      formData.append('realtype', question.realtype);
      formData.append('options', JSON.stringify(question.options));
      if(question.file){
        formData.append('data', question.file); 
      }
    }
    return this.http.patch<IsAuth>(`${environment.BASE_URL}/question/update/${id}`, formData, {
      headers: new HttpHeaders({'x-access-token': `${this.getToken()}`})
    });
  }
 
  public getToken(): string{
    const tkn: string = localStorage.getItem('tkn') || '';
    return tkn;
  }

  emitLoadQuestionList() {
    this.loadQuestionList.next();
  }

  emitQuestions(data: {page: string, pageAdd: string}) {
    this.questionsList.next(data);
  }

  emitDataQuestion(data: {page: string, pageAdd: string, question: Question, edit: boolean}) {
    this.dataQuestion.next(data);
  }

  emitDataQuestionPanel(data: {page: string, pageAdd: string, question: Question}) {
    this.dataQuestionPanel.next(data);
  }

}
