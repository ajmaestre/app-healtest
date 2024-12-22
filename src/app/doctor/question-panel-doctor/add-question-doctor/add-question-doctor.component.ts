import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Question } from '../../../interfaces/question';
import { QuestionPanelDoctorService } from '../question-panel-doctor.service';
import { IsAuth } from '../../../interfaces/isAuth';
import { Option } from '../../../interfaces/option';

@Component({
  selector: 'app-add-question-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './add-question-doctor.component.html',
  styleUrl: './add-question-doctor.component.css'
})
export class AddQuestionDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveSubscription!: Subscription;
  fileSubscription!: Subscription;
  dataQuestion: Question = {};
  selectedFile?: File;
  realTypeFile?: string;
  imageUrl: SafeUrl = '';

  constructor(private questionService: QuestionPanelDoctorService, private sanitizer: DomSanitizer){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      keyword: new FormControl('', Validators.required),
      question: new FormControl('', Validators.required),
      options: new FormArray([this.createOption()], Validators.required),
    });
  }

  ngOnInit(): void {
    this.questionService.dataQuestionSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.question);
        this.chargeImage(dataSended.question);
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
  }

  get options(): FormArray {
    return this.data.get('options') as FormArray;
  }

  createOption(): FormControl {
    return new FormControl('', Validators.required);
  }

  addOption() {
    this.options.push(this.createOption());
  }

  removeOption() {
    this.options.removeAt(this.options.length-1);
  }

  onSubmit() {
    console.log(this.data.value);
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      question: {},
      edit: false
    }
    this.questionService.emitDataQuestion(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.questionService.emitDataQuestion(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    if(this.data.value?.id){
      this.updateQuestion();
    }else{
      this.saveQuestion();
    }
  }

  onLoad(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
    if(this.selectedFile?.name){
      this.realTypeFile = this.selectedFile.type;
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
    }
  }

  saveQuestion(){
    if(this.selectedFile){
      this.dataQuestion = {};
      if(this.verifyFields()){
        this.dataQuestion = this.data.value;
        this.dataQuestion.file = this.selectedFile;
        this.dataQuestion.realtype = this.realTypeFile;
        this.saveSubscription = this.questionService.saveQuestion(this.dataQuestion).subscribe({
          next: (res: IsAuth) =>{
            if(res.response){
              this.setMessage('Pregunta registrada');
              this.clearForm(); 
              this.chargeListQuestions();
            }else{
              this.setMessage('La pregunta no pudo ser registrada');
            }
          },
          error: (err: any) => {
            this.setMessage('La pregunta no pudo ser registrada');
          }
        }); 
      }else{
        this.setMessage('Debe rellenar todos los campos');
      }
    }else{
      this.setMessage('Debe escoger una imagen');
    } 
  }

  updateQuestion(){
    this.dataQuestion = {};
    if(this.verifyFields()){
      this.dataQuestion = this.data.value;
      this.dataQuestion.file = this.selectedFile;
      this.dataQuestion.realtype = this.realTypeFile;
      this.saveSubscription = this.questionService.updateQuestion(this.data.value.id, this.dataQuestion).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Pregunta actualizada');
          }
          this.chargeListQuestions();
        },
        error: (err: any) => {
          this.setMessage('La pregunta no pudo ser actualizada');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  chargeImage(dataSended: Question){
    if(dataSended.id){
      this.fileSubscription = this.questionService.getQuestion(dataSended.id).subscribe({
        next: (res: Blob) =>{
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeData = (dataSended: Question) => {
    this.data.get('id')?.setValue(dataSended?.id);
    this.data.get('question')?.setValue(dataSended?.question);
    this.data.get('keyword')?.setValue(dataSended?.keyword);
    this.data.get('options')?.reset('');
    this.realTypeFile = dataSended.realtype;
    if(dataSended.options)
      this.chargeOptions(dataSended.options);
  }

  chargeOptions(list: Option[]){
    this.removeOption();
    const values: string[] = [];
    list.forEach((element, index) => {
      if(element.option){
        values.push(element.option)
        this.addOption();
      }
    });
    this.data.get('options')?.setValue(values);
  }

  chargeListQuestions = () => {
    this.questionService.emitLoadQuestionList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.question == '') || 
        (this.data.value.keyword == '') ||
        (!this.options.length)){
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
    this.data.get('question')?.setValue('');
    this.data.get('keyword')?.setValue('');
    this.clearOptions();
    this.data.get('options')?.setValue(['']);
    this.selectedFile = undefined;
    this.imageUrl = '';
  }

  clearOptions(){
    const size = this.options.length;
    for(let i = 1; i < size; i++){
      this.removeOption();
    }
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.fileSubscription?.unsubscribe();
  }

}
