import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { SizeList } from '../../../interfaces/sizeList';
import { Question } from '../../../interfaces/question';
import { Test } from '../../../interfaces/test';
import { TestPanelDoctorService } from '../test-panel-doctor.service';
import { IsAuth } from '../../../interfaces/isAuth';
import { Option } from '../../../interfaces/option';

@Component({
  selector: 'app-add-test-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    EmptyPageComponent,
  ],
  templateUrl: './add-test-doctor.component.html',
  styleUrl: './add-test-doctor.component.css'
})
export class AddTestDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  limit: number = 6;
  pageSize: number = 0;
  countQuestions: SizeList = { count: 0 };
  
  newTitle: string = "Sin preguntas";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  newMessage2: string = "Seleccione las preguntas de la lista en el panel izquierdo.";
  questionList: Question[] = [];
  listQuestInTest: Question[] = [];
  questSelected?: Question;
  index: number = 0;

  data: FormGroup;
  saveSubscription!: Subscription;
  questionsSubscription!: Subscription;
  countSubscription!: Subscription;
  optionsSubscription!: Subscription;
  fileSubscription!: Subscription;
  dataTest: Test = {};


  constructor(private testService: TestPanelDoctorService, private sanitizer: DomSanitizer){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      dateEnd: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.testService.dataTestSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.test);
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
      this.getQuestions(this.limit, this.pageSize);
      this.selectPageQuest(0);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      test: {},
      edit: false
    }
    this.testService.emitDataTest(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.testService.emitDataTest(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    if(this.data.value?.id){
      this.updateTest();
    }else{
      this.saveTest();
    }
  }

  saveTest(){
    this.dataTest = {};
    if(this.verifyFields()){
      this.dataTest = this.data.value;
      this.dataTest.questions = this.listQuestInTest;
      this.saveSubscription = this.testService.saveTest(this.dataTest).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Evaluación registrada');
            this.clearForm(); 
            this.chargeListTest();
          }else{
            this.setMessage('La evaluación no pudo ser registrada');
          }
        },
        error: (err: any) => {
          this.setMessage('La evaluación no pudo ser registrada');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    } 
  }

  updateTest(){
    this.dataTest = {};
    if(this.verifyFields()){
      this.dataTest = this.data.value;
      this.dataTest.questions = this.listQuestInTest;
      this.saveSubscription = this.testService.updateTest(this.data.value.id, this.dataTest).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Evaluación actualizada');
          }
          this.chargeListTest();
        },
        error: (err: any) => {
          this.setMessage('La evaluación no pudo ser actualizada');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  getQuestions = (limit: number, page: number) => {
    this.questionsSubscription = this.testService.getQuestions(limit, page).subscribe({
      next: (res: Question[]) =>{
        this.questionList = res;
        this.insertOptionInList();
        this.getCountQuestions();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountQuestions = () => {
    this.countSubscription = this.testService.getCountQuestions().subscribe({
      next: (res: SizeList) =>{
        this.countQuestions = res;
      },
      error: (err: any) => {
        console.log(err);
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

  insertOptionInList = () => {
    this.questionList.forEach((element) => {
      this.getOptions(element);
      this.getImage(element);
    });
  }

  getOptions = (question: Question) => {
    if(question.id){
      this.optionsSubscription = this.testService.getOptionsByQuestion(question.id).subscribe({
        next: (res: Option[]) =>{
          question.options = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  selectQuestion = (question: Question) => {
    if(this.listIncludes(question)){
      this.listQuestInTest = this.listQuestInTest.filter((value, index, array) => value.id != question.id);
      this.questSelected = this.listQuestInTest.at(0);
    }else{
      this.listQuestInTest.push(question);
      this.questSelected = question;
    }
  }

  classProject = (question: Question) => {
    if(this.listIncludes(question)){
      return 'div-project active';
    }
    return 'div-project';
  }

  listIncludes(question: Question): boolean{
    let finded: boolean = false;
    this.listQuestInTest.forEach((element) => {
      if(element.id == question.id){
        finded = true;
      }
    });
    return finded;
  }

  chargeData = (dataSended: Test) => {
    this.data.get('id')?.setValue(dataSended?.id);
    this.data.get('name')?.setValue(dataSended?.name);
    if(dataSended.dateend){
      const date_end = new Date(dataSended.dateend);
      this.data.get('dateEnd')?.setValue(date_end.toISOString().substring(0, 10));
    }
    if(dataSended.questions){
      this.listQuestInTest = dataSended.questions;
      this.chargeOptionInList();
    }
  }

  chargeOptionInList = () => {
    this.listQuestInTest.forEach((element) => {
      this.getOptions(element);
      this.getImage(element);
    });
  }

  chargeListTest = () => {
    this.testService.emitLoadTestList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.dateEnd == '')){
      return false;
    }
    return true;
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  clearForm(){
    this.data.get('id')?.setValue('');
    this.data.get('name')?.setValue('');
    this.data.get('dateEnd')?.setValue('');
    this.listQuestInTest = [];
  }

  reloadList = () => {
    this.getQuestions(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countQuestions.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 6 < this.countQuestions?.count){
      this.pageSize += 6; 
      this.getQuestions(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 6; 
      this.getQuestions(this.limit, this.pageSize);
    }
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
    this.saveSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
    this.fileSubscription?.unsubscribe();
  }

}
