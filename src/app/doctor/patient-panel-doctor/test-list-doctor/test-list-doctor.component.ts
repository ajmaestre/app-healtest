import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { Test } from '../../../interfaces/test';
import { Subscription } from 'rxjs';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';
import { Question } from '../../../interfaces/question';

@Component({
  selector: 'app-test-list-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './test-list-doctor.component.html',
  styleUrl: './test-list-doctor.component.css'
})
export class TestListDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countTests: SizeList = { count: 0 };

  @Input() idUser: number = 0;

  newTitle: string = "Sin evaluaciones";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  testList: Test[] = [];

  testsSubscription!: Subscription;
  questionsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;

  data: FormGroup;

  constructor(private patientService: PatientPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.testList = [];
    this.limit = 4;
    this.pageSize = 0;
    if(this.idUser)
      this.getTests(this.limit, this.pageSize);
  }
  
  openTestDataPanel = (test: Test) => {
    if(test.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        test: test,
        idUser: this.idUser
      }
      this.patientService.emitDataTestPanel(data);
    }
  }

  getTests = (limit: number, page: number) => {
    this.testsSubscription = this.patientService.getTests(this.idUser, limit, page).subscribe({
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
    this.countSubscription = this.patientService.getCountTests(this.idUser).subscribe({
      next: (res: SizeList) =>{
        this.countTests = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getTestsByAll = () => {
    this.searchSubscription = this.patientService.getTestsByAll(this.idUser, this.data.value.search, this.limit, this.pageSize).subscribe({
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
      this.questionsSubscription = this.patientService.getQuestionsByTest(test.id).subscribe({
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
