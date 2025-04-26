import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Activity } from '../../../interfaces/activity';
import { Subscription } from 'rxjs';
import { Task } from '../../../interfaces/task';
import { ActivityPanelPatientService } from '../activity-panel-patient.service';
import { Resourse } from '../../../interfaces/resourse';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-task-panel-patient',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './task-panel-patient.component.html',
  styleUrl: './task-panel-patient.component.css'
})
export class TaskPanelPatientComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  taskSubscription!: Subscription;
  saveResourseSubscription!: Subscription;
  fileSubscription!: Subscription;
  resourseSubscription!: Subscription;
  dataResourse: Resourse = {};
  selectedFile?: File;
  typeFile?: string;
  realTypeFile?: string;

  dataActivity: Activity = {};
  dataTask: Task = {};


  constructor(private activityService: ActivityPanelPatientService){}

  ngOnInit(): void {
    this.activityService.dataActivityTaskSent$.subscribe((dataSended) => {
      if(dataSended.activity){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.activity);
        this.chargeTask(dataSended.activity);
        this.chargeResponse(dataSended.activity);
      }else{
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      activity: {},
    }
    this.activityService.emitDataActivityTask(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataActivityTask(data);
    }, 500);
  }

  chargeData(dataSended: Activity){ 
    this.dataActivity = dataSended;
    this.formatDate(this.dataActivity);
  }

  formatDate = (activity: Activity) => {
    if(activity.created_at){
      activity.created_at = new Date(activity.created_at);
    }
  }

  getDate(activity: Activity){
    if(activity.created_at?.getMonth())
      return `${activity.created_at?.getFullYear()}/${activity.created_at?.getMonth()+1}/${activity.created_at?.getDate()}`;
    return `${activity.created_at?.getFullYear()}/${activity.created_at?.getMonth()}/${activity.created_at?.getDate()}`;
  }

  chargeTask(dataSended: Activity){
    if(dataSended.id){
      this.taskSubscription = this.activityService.getTask(dataSended.id).subscribe({
        next: (res: Task) => {
          this.dataTask = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeResponse(dataSended: Activity){
    if(dataSended.id){
      this.resourseSubscription = this.activityService.getDataResourseTask(dataSended.id).subscribe({
        next: (res: Resourse) => {
          this.dataResourse = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  onLoad(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
    if(this.selectedFile?.name){
      const nameFile = this.selectedFile?.name.split(".");
      this.typeFile = nameFile[nameFile.length-1];
      this.realTypeFile = this.selectedFile.type;
    }
  }

  download(){
    if(this.dataResourse.id && this.dataActivity.id){
      this.fileSubscription = this.activityService.getResponseTask(this.dataActivity.id).subscribe({
        next: (res: Blob) =>{
          const url = URL.createObjectURL(res);
          window.open(url, '_blank');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }else if(this.selectedFile?.name){
      const url = URL.createObjectURL(this.selectedFile);
      window.open(url, '_blank');
    }else{
      this.setMessage('El recurso no ha sido seleccionado');
    }
  }

  sendData(){
    if(this.dataResourse.id){
      // this.updateResourse();
    }else{
      this.saveResourse();
    }
  }

  saveResourse(){
    if(this.selectedFile && this.dataActivity.id){
      if(this.verifyFields()){
        this.dataResourse.name = this.dataTask.name;
        this.dataResourse.description = this.dataTask.description;
        this.dataResourse.file = this.selectedFile;
        this.dataResourse.type = this.typeFile;
        this.dataResourse.realtype = this.realTypeFile;
        this.saveResourseSubscription = this.activityService.saveResourse(this.dataActivity.id, this.dataResourse).subscribe({
          next: (res: IsAuth) =>{
            if(res.response){
              this.setMessage('Recurso registrado');
            }else{
              this.setMessage('El recurso no pudo ser registrado');
            }
          },
          error: (err: any) => {
            console.log(err);
            this.setMessage('El recurso no pudo ser registrado');
          }
        }); 
      }else{
        this.setMessage('Debe rellenar todos los campos');
      }
    }else{
      this.setMessage('Debe escoger un archivo');
    } 
  }

  // updateResourse(){
  //   if(this.verifyFields()){
  //     this.dataResourse.name = this.dataTask.name;
  //     this.dataResourse.description = this.dataTask.description;
  //     this.dataResourse.file = this.selectedFile;
  //     this.dataResourse.type = this.typeFile;
  //     this.dataResourse.realtype = this.realTypeFile;
  //     this.saveResourseSubscription = this.activityService.updateResourse(this.data.value.id, this.data.value).subscribe({
  //       next: (res: IsAuth) =>{
  //         if(res.response){
  //           this.setMessage('Recurso actualizado');
  //         }
  //       },
  //       error: (err: any) => {
  //         this.setMessage('El recurso no pudo ser actualizado');
  //       }
  //     }); 
  //   }else{
  //     this.setMessage('Debe rellenar todos los campos');
  //   }
  // }

  verifyFields = ():boolean => {
    if((this.dataTask.name == '') || 
        (this.dataTask.description == '')){
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

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.resourseSubscription?.unsubscribe();
    this.fileSubscription?.unsubscribe();
    this.saveResourseSubscription?.unsubscribe();
  }

}

