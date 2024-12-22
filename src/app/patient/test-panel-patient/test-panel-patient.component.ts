import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { Test } from '../../interfaces/test';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestPanelPatientService } from './test-panel-patient.service';
import { Question } from '../../interfaces/question';
import { Router } from '@angular/router';
import { TestingPanelPatientService } from '../../testing-panel-patient/testing-panel-patient.service';
import { Response } from '../../interfaces/response';

@Component({
  selector: 'app-test-panel-patient',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './test-panel-patient.component.html',
  styleUrl: './test-panel-patient.component.css'
})
export class TestPanelPatientComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countTests: SizeList = { count: 0 };

  newTitle: string = "Sin evaluaciones";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  testList: Test[] = [];

  data: FormGroup;

  testsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  stateSubscription!: Subscription;

  
  constructor(private testService: TestPanelPatientService, private testingService: TestingPanelPatientService, private router: Router){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.testService.listTestLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getTests(this.limit, this.page);
    });
  }

  isDisabled = (test: Test) => {
    if(test.state == 'Terminada' || test.state == 'Vencida'){
      return 'div-project disabled';
    }
    return 'div-project enabled';
  }

  openTestDataPanel = (test: Test) => {
    if(test.state == 'Pendiente'){
      if(test.id){
        const data = {
          test: test
        };
        this.testingService.emitLoadData(data);
        this.router.navigate(['/testing']);
      }
    }
  }

  getTests = (limit: number, page: number) => {
    this.testsSubscription = this.testService.getTests(limit, page).subscribe({
      next: (res: Test[]) =>{
        this.testList = res;
        this.insertQuestionInList();
        this.getCountTests();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountTests = () => {
    this.countSubscription = this.testService.getCountTests().subscribe({
      next: (res: SizeList) =>{
        this.countTests = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertQuestionInList = () => {
    this.testList.forEach((element) => {
      this.getQuestions(element);
      this.getState(element);
      this.formatDate(element);
    });
  }

  getState = (test: Test) => {
    if(test.id){
      this.stateSubscription = this.testingService.getStateTest(test.id).subscribe({
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
      this.testsSubscription = this.testService.getQuestionsByTest(test.id).subscribe({
        next: (res: Question[]) =>{
          test.questions = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getTestsByAll = () => {
    this.searchSubscription = this.testService.getTestsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Question[]) =>{
        this.testList = res;
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
    this.getTests(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countTests.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countTests?.count){
      this.page += 6; 
      this.getTests(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getTests(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.testsSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }

}
