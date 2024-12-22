import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { Question } from '../../interfaces/question';
import { Option } from '../../interfaces/option';
import { QuestionPanelDoctorService } from './question-panel-doctor.service';
import { QuestionListPanelDoctorComponent } from './question-list-panel-doctor/question-list-panel-doctor.component';
import { QuestionDataPanelDoctorComponent } from './question-data-panel-doctor/question-data-panel-doctor.component';
import { AddQuestionDoctorComponent } from './add-question-doctor/add-question-doctor.component';

@Component({
  selector: 'app-question-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddQuestionDoctorComponent,
    QuestionDataPanelDoctorComponent,
    QuestionListPanelDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './question-panel-doctor.component.html',
  styleUrl: './question-panel-doctor.component.css'
})
export class QuestionPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countQuestions: SizeList = { count: 0 };
  
  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin preguntas";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  questionList: Question[] = [];

  data: FormGroup;

  questionsSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  optionsSubscription!: Subscription;

  
  constructor(private questionService: QuestionPanelDoctorService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.questionService.listQuestionLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getQuestions(this.limit, this.page);
    });
    this.confirmService.listQuestionLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getQuestions(this.limit, this.page);
    });
  }

  openPageConfirm = (question: Question) => {
    if(question.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: question.id, typeElement: 'question'});
    }
  }

  chargeDataQuestion = (question: Question) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      question: question,
      edit: true
    }
    this.questionService.emitDataQuestion(data);
  }

  openModalAddQuestion = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      question: {},
      edit: false
    }
    this.questionService.emitDataQuestion(data);
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
    this.searchSubscription = this.questionService.getQuestionsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Question[]) =>{
        this.questionList = res;
        this.insertOptionInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  reloadList = () => {
    this.limit = 6;
    this.page = 0;
    this.getQuestions(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countQuestions.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countQuestions?.count){
      this.page += 6; 
      this.getQuestions(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getQuestions(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.questionsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
  }

}
