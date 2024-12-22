import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../interfaces/sizeList';
import { Test } from '../../interfaces/test';
import { Subscription } from 'rxjs';
import { ResultPanelPatientService } from './result-panel-patient.service';
import { Response } from '../../interfaces/response';
import { Question } from '../../interfaces/question';
import { ResultDataPanelPatientComponent } from './result-data-panel-patient/result-data-panel-patient.component';

@Component({
  selector: 'app-result-panel-patient',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    ResultDataPanelPatientComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './result-panel-patient.component.html',
  styleUrl: './result-panel-patient.component.css'
})
export class ResultPanelPatientComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countResult: SizeList = { count: 0 };

  newTitle: string = "Sin resultados";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  resultList: Test[] = [];

  data: FormGroup;

  testsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  stateSubscription!: Subscription;

  
  constructor(private resultService: ResultPanelPatientService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.resultService.listResultLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getResults(this.limit, this.page);
    });
  }

  openResultDataPanel = (test: Test) => {
    if(test.id){
      const data = {
        page: 'div-form-add show',
        pageAdd: 'page-add',
        test: test,
      }
      this.resultService.emitDataResultPanel(data);
    }
  }

  getResults = (limit: number, page: number) => {
    this.testsSubscription = this.resultService.getResults(limit, page).subscribe({
      next: (res: Test[]) =>{
        this.resultList = res;
        this.insertQuestionInList();
        this.getCountResults();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountResults = () => {
    this.countSubscription = this.resultService.getCountResults().subscribe({
      next: (res: SizeList) =>{
        this.countResult = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertQuestionInList = () => {
    this.resultList.forEach((element) => {
      this.getQuestions(element);
      this.getState(element);
      this.formatDate(element);
    });
  }

  getState = (test: Test) => {
    if(test.id){
      this.stateSubscription = this.resultService.getStateTest(test.id).subscribe({
        next: (res: Response) =>{
          if(res){
            test.state = res.response;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  formatDate = (test: Test) => {
    if(test.dateend && test.dateinit){
      test.dateend = new Date(test.dateend);
      test.dateinit = new Date(test.dateinit);
    }
  }

  getDateInit(test: Test){
    if(test.dateinit?.getMonth())
      return `${test.dateinit?.getFullYear()}/${test.dateinit?.getMonth()+1}/${test.dateinit?.getDate()}`;
    return `${test.dateinit?.getFullYear()}/${test.dateinit?.getMonth()}/${test.dateinit?.getDate()}`;
  }

  getDateEnd(test: Test){
    if(test.dateend?.getMonth())
      return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()+1}/${test.dateinit?.getDate()}`;
    return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()}/${test.dateinit?.getDate()}`;
  }

  getQuestions = (test: Test) => {
    if(test.id){
      this.testsSubscription = this.resultService.getQuestionsByTest(test.id).subscribe({
        next: (res: Question[]) =>{
          test.questions = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getResultsByAll = () => {
    this.searchSubscription = this.resultService.getResultsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Question[]) =>{
        this.resultList = res;
        this.insertQuestionInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  reloadList = () => {
    this.limit = 6;
    this.page = 0;
    this.getResults(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countResult.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countResult?.count){
      this.page += 6; 
      this.getResults(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getResults(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.testsSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }

}
