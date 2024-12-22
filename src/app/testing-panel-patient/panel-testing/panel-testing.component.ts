import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Test } from '../../interfaces/test';
import { Subscription } from 'rxjs';
import { Question } from '../../interfaces/question';
import { TestingPanelPatientService } from '../testing-panel-patient.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Option } from '../../interfaces/option';
import { Router } from '@angular/router';
import { TestResponse } from '../../interfaces/testResponse';
import { IsAuth } from '../../interfaces/isAuth';

@Component({
  selector: 'app-panel-testing',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './panel-testing.component.html',
  styleUrl: './panel-testing.component.css'
})
export class PanelTestingComponent implements OnInit, OnDestroy{

  divWarning: string = 'div-warning hide';
  message:string = '';

  dataTest: Test = {};

  fileSubscription!: Subscription;
  optionsSubscription!: Subscription;
  saveSubscription!: Subscription;

  listQuestInTest: Question[] = [];
  questSelected?: Question;
  index: number = 0;

  listResponseInTest: TestResponse[] = [];


  constructor(
    private testService: TestingPanelPatientService, 
    private sanitizer: DomSanitizer,
    private router: Router
  ){}

  ngOnInit(): void {
    this.testService.loadedData$.subscribe((dataSended) => {
      if(dataSended.test.id){
        this.chargeData(dataSended.test);
      }else{
        this.cancelar();
      }
    });
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
    if(dataSended.questions){
      this.listQuestInTest = dataSended.questions;
      this.chargeOptionInList();
    }
  }

  chargeOptionInList = () => {
    this.listQuestInTest.forEach((element) => {
      this.chargeOptions(element);
      this.getImage(element);
    });
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

  selectOption = (question?: Question, option?: Option) => {
    const res = this.listResponseInTest.find((value, index) => value.question_id==question?.id);
    if(res){
      res.option_id = option?.id;
    }else{
      this.listResponseInTest.push({test_id: this.dataTest.id, question_id: question?.id, option_id: option?.id})
    }
  }

  isSelected = (option?: Option) => {
    const res = this.listResponseInTest.find((value, index) => value.option_id == option?.id);
    if(res){
      return 'selected';
    }else{
      return 'input';
    }
  }

  saveResponseTest(){
    this.saveSubscription = this.testService.saveResponseTest(this.listResponseInTest).subscribe({
      next: (res: IsAuth) =>{
        if(res.response){
          this.setMessage('Respuesta registrada');
          this.cancelar();
        }else{
          this.setMessage('La respuesta no pudo ser registrada');
        }
      },
      error: (err: any) => {
        this.setMessage('La respuesta no pudo ser registrada');
      }
    });
  }

  sendData = () => {
    if(this.listQuestInTest.length == this.listResponseInTest.length){
      this.saveResponseTest();
    }else{
      this.setMessage('Debe contestar todas las preguntas');
    }
  }

  cancelar = () => {
    this.router.navigate(['/patient']);
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

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  ngOnDestroy(): void {
    this.fileSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

}
