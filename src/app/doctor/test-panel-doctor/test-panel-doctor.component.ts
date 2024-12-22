import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../interfaces/sizeList';
import { Test } from '../../interfaces/test';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { Question } from '../../interfaces/question';
import { TestPanelDoctorService } from './test-panel-doctor.service';
import { TestDataPanelDoctorComponent } from './test-data-panel-doctor/test-data-panel-doctor.component';
import { AddTestDoctorComponent } from './add-test-doctor/add-test-doctor.component';
import { TestListPanelDoctorComponent } from './test-list-panel-doctor/test-list-panel-doctor.component';
import { GroupTestAddDoctorComponent } from './group-test-add-doctor/group-test-add-doctor.component';

@Component({
  selector: 'app-test-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddTestDoctorComponent,
    TestDataPanelDoctorComponent,
    TestListPanelDoctorComponent,
    GroupTestAddDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './test-panel-doctor.component.html',
  styleUrl: './test-panel-doctor.component.css'
})
export class TestPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countTests: SizeList = { count: 0 };
  
  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin evaluaciones";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  testList: Test[] = [];

  data: FormGroup;

  testsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  questionsSubscription!: Subscription;

  
  constructor(private testService: TestPanelDoctorService, private confirmService: PanelConfirmService){
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
    this.confirmService.listTestLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getTests(this.limit, this.page);
    });
  }

  openPageConfirm = (test: Test) => {
    if(test.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: test.id, typeElement: 'test'});
    }
  }

  chargeDataTest = (test: Test) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      test: test,
      edit: true
    }
    this.testService.emitDataTest(data);
  }

  openModalAddTest = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      test: {},
      edit: false
    }
    this.testService.emitDataTest(data);
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
      this.formatDate(element);
    });
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
    this.questionsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.testsSubscription?.unsubscribe();
  }

}
