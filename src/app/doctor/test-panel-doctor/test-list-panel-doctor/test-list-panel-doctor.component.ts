import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { SizeList } from '../../../interfaces/sizeList';
import { Test } from '../../../interfaces/test';
import { TestPanelDoctorService } from '../test-panel-doctor.service';
import { Question } from '../../../interfaces/question';

@Component({
  selector: 'app-test-list-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './test-list-panel-doctor.component.html',
  styleUrl: './test-list-panel-doctor.component.css'
})
export class TestListPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countTests: SizeList = { count: 0 };

  newTitle: string = "Sin evaluaciones";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  testList: Test[] = [];

  page: string = '';
  pageAdd: string = '';

  testsSubscription!: Subscription;
  questionsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;

  data: FormGroup;

  constructor(private testService: TestPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.testService.testsLoaded$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
    this.getTests(this.limit, this.pageSize);
  }
  
  openTestDataPanel = (test: Test) => {
    if(test.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        test: test,
      }
      this.testService.emitDataTestPanel(data);
    }
  }

  getTests = (limit: number, page: number) => {
    this.testsSubscription = this.testService.getTests(limit, page).subscribe({
      next: (res: Test[]) =>{
        this.testList = res;
        this.chargeQuestions();
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

  getTestsByAll = () => {
    this.searchSubscription = this.testService.getTestsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
      next: (res: Test[]) =>{
        this.testList = res;
        this.chargeQuestions();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  chargeQuestions = () => {
    this.testList.forEach((element) => {
      this.getQuestionByTest(element);
      this.formatDate(element);
    });
  }

  getQuestionByTest = (test: Test) => {
    if(test.id){
      this.questionsSubscription = this.testService.getQuestionsByTest(test.id).subscribe({
        next: (res: Question[]) =>{
          if(res){
            test.questions = res;
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
      return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()+1}/${test.dateend?.getDate()}`;
    return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()}/${test.dateend?.getDate()}`;
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.testService.emitTests(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.testService.emitTests(data);
    }, 500);
  }

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getTests(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countTests.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countTests?.count){
      this.pageSize += 4; 
      this.getTests(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getTests(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.testsSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

}
