import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Test } from '../../../interfaces/test';
import { Subscription } from 'rxjs';
import { Question } from '../../../interfaces/question';
import { ResultPanelPatientService } from '../result-panel-patient.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Option } from '../../../interfaces/option';
import { PatientService } from '../../patient.service';
import { User } from '../../../interfaces/user';
import { Group } from '../../../interfaces/group';
import { TestResponse } from '../../../interfaces/testResponse';

@Component({
  selector: 'app-result-data-panel-patient',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './result-data-panel-patient.component.html',
  styleUrl: './result-data-panel-patient.component.css'
})
export class ResultDataPanelPatientComponent implements OnInit, OnDestroy{
 
  page: string = '';
  pageAdd: string = '';

  dataTest: Test = {};
  listResponses: TestResponse[] = [];

  fileSubscription!: Subscription;
  optionsSubscription!: Subscription;
  profileSubscription!: Subscription;
  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  resultSubscription!: Subscription;

  userData: User = {};

  listQuestInTest: Question[] = [];
  questSelected?: Question;
  index: number = 0;


  constructor(
    private resultService: ResultPanelPatientService, 
    private patientService: PatientService,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.resultService.dataResultPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.test){
        this.chargeData(dataSended.test);
        this.getResponses(dataSended.test);
      }
    });
    this.getProfile();
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      test: {}
    }
    this.resultService.emitDataResultPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resultService.emitDataResultPanel(data);
    }, 500);
  }
  
  getImage(question: Question){
    if(question.id){
      this.fileSubscription = this.resultService.getQuestion(question.id).subscribe({
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

  chargeOptions = (question: Question) => {
    if(question.id){
      this.optionsSubscription = this.resultService.getOptionsByQuestion(question.id).subscribe({
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

  getProfile = () => {
    this.profileSubscription = this.patientService.getProfile().subscribe({
      next: (res: User) =>{
        this.userData = res;
        this.getGroupByPatient(this.userData);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupByPatient = (user: User) => {
    if(user.id){
      this.groupsSubscription = this.patientService.getGroupByPatient(user.id).subscribe({
        next: (res: Group) =>{
          if(res){
            user.groups = [res];
            this.getMonitorName(user, res);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getMonitorName = (user: User, group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.patientService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          user.monitor = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getResponses = (test: Test) => {
    if(test.id){
      this.resultSubscription = this.resultService.getResponses(test.id).subscribe({
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
    this.profileSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
    this.resultSubscription?.unsubscribe();
  }

}
