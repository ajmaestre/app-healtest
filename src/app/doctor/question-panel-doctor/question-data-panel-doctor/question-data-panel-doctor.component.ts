import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Question } from '../../../interfaces/question';
import { QuestionPanelDoctorService } from '../question-panel-doctor.service';

@Component({
  selector: 'app-question-data-panel-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './question-data-panel-doctor.component.html',
  styleUrl: './question-data-panel-doctor.component.css'
})
export class QuestionDataPanelDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  dataQuestion: Question = {};
  fileSubscription!: Subscription;
  selectedFile?: File;
  realTypeFile?: string;
  imageUrl: SafeUrl = '';


  constructor(private questionService: QuestionPanelDoctorService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.questionService.dataQuestionPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.question){
        this.chargeData(dataSended.question);
        this.chargeImage(dataSended.question);
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      question: {}
    }
    this.questionService.emitDataQuestionPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.questionService.emitDataQuestionPanel(data);
    }, 500);
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
    this.dataQuestion = dataSended;
  }

  ngOnDestroy(): void {
    this.fileSubscription?.unsubscribe();
  }

}
