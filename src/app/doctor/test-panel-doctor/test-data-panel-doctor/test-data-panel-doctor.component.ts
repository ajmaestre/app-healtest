import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Test } from '../../../interfaces/test';
import { Question } from '../../../interfaces/question';
import { TestPanelDoctorService } from '../test-panel-doctor.service';
import { Option } from '../../../interfaces/option';

@Component({
  selector: 'app-test-data-panel-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './test-data-panel-doctor.component.html',
  styleUrl: './test-data-panel-doctor.component.css'
})
export class TestDataPanelDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  dataTest: Test = {};

  fileSubscription!: Subscription;
  optionsSubscription!: Subscription;

  listQuestInTest: Question[] = [];
  questSelected?: Question;
  index: number = 0;


  constructor(private testService: TestPanelDoctorService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.testService.dataTestPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.test)
        this.chargeData(dataSended.test);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      test: {}
    }
    this.testService.emitDataTestPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.testService.emitDataTestPanel(data);
    }, 500);
  }
  
  openModalAddTestInGroup = () => {
    if(this.dataTest.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: this.dataTest.id,
        edit: false,
      }
      this.testService.emitDataGroupAddPanel(data);
    }
  }


  getImage(question: Question){
    if(question.id){
      this.fileSubscription = this.testService.getQuestion(question.id).subscribe({
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
    this.formatDate(this.dataTest);
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

  chargeOptionInList = () => {
    this.listQuestInTest.forEach((element) => {
      this.chargeOptions(element);
      this.getImage(element);
    });
  }

  chargeImage(question: Question){
    if(question.id){
      this.fileSubscription = this.testService.getQuestion(question.id).subscribe({
        next: (res: Blob) =>{
          question.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeOptions = (question: Question) => {
    if(question.id){
      this.optionsSubscription = this.testService.getOptionsByQuestion(question.id).subscribe({
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

  isPages = (): boolean => {
    if(this.listQuestInTest.length > 1){
      return true;
    }
    return false;
  }

  selectPageQuest = (index: number) => {
    this.questSelected = this.listQuestInTest.at(index);
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
  }

}
