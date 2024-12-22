import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../../interfaces/sizeList';
import { Question } from '../../../interfaces/question';
import { Subscription } from 'rxjs';
import { Option } from '../../../interfaces/option';
import { SafeUrl } from '@angular/platform-browser';
import { QuestionPanelDoctorService } from '../question-panel-doctor.service';

@Component({
  selector: 'app-question-list-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './question-list-panel-doctor.component.html',
  styleUrl: './question-list-panel-doctor.component.css'
})
export class QuestionListPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countQuestions: SizeList = { count: 0 };

  newTitle: string = "Sin preguntas";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  questionList: Question[] = [];

  page: string = '';
  pageAdd: string = '';

  questionsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  optionsSubscription!: Subscription;
  fileSubscription!: Subscription;

  data: FormGroup;
  imageUrl: SafeUrl = '';

  constructor(private questionService: QuestionPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.questionService.questionsLoaded$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
    this.getQuestions(this.limit, this.pageSize);
  }

  openQuestionDataPanel = (question: Question) => {
    if(question.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        question: question,
      }
      this.questionService.emitDataQuestionPanel(data);
    }
  }

  getQuestions = (limit: number, page: number) => {
    this.questionsSubscription = this.questionService.getQuestions(limit, page).subscribe({
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
    this.countSubscription = this.questionService.getCountQuestions().subscribe({
      next: (res: SizeList) =>{
        this.countQuestions = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertOptionInList = () => {
    this.questionList.forEach((element) => {
      this.getOptions(element);
    });
  }

  getOptions = (question: Question) => {
    if(question.id){
      this.optionsSubscription = this.questionService.getOptionsByQuestion(question.id).subscribe({
        next: (res: Option[]) =>{
          question.options = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getQuestionsByAll = () => {
    this.searchSubscription = this.questionService.getQuestionsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
      next: (res: Question[]) =>{
        this.questionList = res;
        this.insertOptionInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.questionService.emitQuestions(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.questionService.emitQuestions(data);
    }, 500);
  }

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getQuestions(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countQuestions.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countQuestions?.count){
      this.pageSize += 4; 
      this.getQuestions(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getQuestions(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.questionsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
  }

}
