import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Test } from '../../../interfaces/test';
import { TestResponse } from '../../../interfaces/testResponse';
import { Subscription } from 'rxjs';
import { Question } from '../../../interfaces/question';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Option } from '../../../interfaces/option';
import { Response } from '../../../interfaces/response';

@Component({
  selector: 'app-test-data-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './test-data-doctor.component.html',
  styleUrl: './test-data-doctor.component.css'
})
export class TestDataDoctorComponent implements OnInit, OnDestroy{
 
  page: string = '';
  pageAdd: string = '';

  dataTest: Test = {};
  idUser: number = 0;
  listResponses: TestResponse[] = [];

  fileSubscription!: Subscription;
  optionsSubscription!: Subscription;
  resultSubscription!: Subscription;
  stateSubscription!: Subscription;
  dateSubscription!: Subscription;

  listQuestInTest: Question[] = [];
  questSelected?: Question;
  index: number = 0;


  constructor(
    private patientService: PatientPanelDoctorService,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.patientService.dataTestPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.test){
        this.idUser = dataSended.idUser;
        this.chargeData(dataSended.test);
        this.getResponses(dataSended.test);
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      test: {},
      idUser: NaN
    }
    this.patientService.emitDataTestPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataTestPanel(data);
    }, 500);
  }
  
  getImage(question: Question){
    if(question.id){
      this.fileSubscription = this.patientService.getQuestion(question.id).subscribe({
        next: (res: Blob) =>{
          question.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeData = (dataSended: Test) => {
    this.dataTest = dataSended;
    this.getTestState(this.dataTest);
    this.getDateResult(this.dataTest);
    if(dataSended.questions){
      this.listQuestInTest = dataSended.questions;
      this.chargeOptionInList();
    }
  }

  formatDate = (test: Test) => {
    if(test.dateend && test.dateinit){
      test.dateend = new Date(test.dateend);
      test.dateinit = new Date(test.dateinit);
    }
    if(test.dateResult){
      test.dateResult = new Date(test.dateResult);
    }
  }

  getTestState = (test: Test) => {
    if(test.id){
      this.stateSubscription = this.patientService.getStateTest(this.idUser, test.id).subscribe({
        next: (res: Response) => {
          test.state = res.response;
        },
        error: (err: any) => {
          console.log(err)
        }
      });
    }
  }

  getDateResult = (test: Test) => {
    if(test.id){
      this.dateSubscription = this.patientService.getDateResult(this.idUser, test.id).subscribe({
        next: (res: Date) => {
          test.dateResult = res;
          this.formatDate(this.dataTest);
        }
      });
    }
  }

  getDateInit(){
    if(this.dataTest.dateinit?.getMonth())
      return `${this.dataTest.dateinit?.getFullYear()}/${this.dataTest.dateinit?.getMonth()+1}/${this.dataTest.dateinit?.getDate()}`;
    return `${this.dataTest.dateinit?.getFullYear()}/${this.dataTest.dateinit?.getMonth()}/${this.dataTest.dateinit?.getDate()}`;
  }

  getDateEnd(){
    if(this.dataTest.dateend?.getMonth())
      return `${this.dataTest.dateend?.getFullYear()}/${this.dataTest.dateend?.getMonth()+1}/${this.dataTest.dateend?.getDate()}`;
    return `${this.dataTest.dateend?.getFullYear()}/${this.dataTest.dateend?.getMonth()}/${this.dataTest.dateend?.getDate()}`;
  }

  getDateRes(){
    if(this.dataTest.dateResult?.getMonth())
      return `${this.dataTest.dateResult?.getFullYear()}/${this.dataTest.dateResult?.getMonth()+1}/${this.dataTest.dateResult?.getDate()}`;
    return `${this.dataTest.dateResult?.getFullYear()}/${this.dataTest.dateResult?.getMonth()}/${this.dataTest.dateResult?.getDate()}`;
  }

  chargeOptionInList = () => {
    this.listQuestInTest.forEach((element) => {
      this.chargeOptions(element);
      this.getImage(element);
    });
  }

  chargeOptions = (question: Question) => {
    if(question.id){
      this.optionsSubscription = this.patientService.getOptionsByQuestion(question.id).subscribe({
        next: (res: Option[]) =>{
          question.options = res;
          this.selectPageQuest(0);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getResponses = (test: Test) => {
    if(test.id){
      this.resultSubscription = this.patientService.getResponses(this.idUser, test.id).subscribe({
        next: (res: TestResponse[]) => {
          this.listResponses = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  isSelected = (question?: Question, option?: Option) => {
    const res = this.listResponses.find((value, index) => value.question_id == question?.id && value.option_id == option?.id);
    if(res){
      return 'selected';
    }
    return 'input';
  }
  
  isPages = (): boolean => {
    if(this.listQuestInTest.length > 1){
      return true;
    }
    return false;
  }

  selectPageQuest = (index: number) => {
    this.index = index;
    this.questSelected = this.listQuestInTest.at(this.index);
  }

  nextPageQuest = () => {
    if(this.index + 1 < this.listQuestInTest?.length){
      this.questSelected = this.listQuestInTest.at(++this.index);
    }
  }

  prePageQuest = () => {
    if(this.index - 1 >= 0){
      this.questSelected = this.listQuestInTest.at(--this.index);
    }
  }

  ngOnDestroy(): void {
    this.fileSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
    this.resultSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
    this.dateSubscription?.unsubscribe();
  }

}
