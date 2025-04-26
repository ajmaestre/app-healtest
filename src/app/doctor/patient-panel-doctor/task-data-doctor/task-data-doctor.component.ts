import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { Activity } from '../../../interfaces/activity';
import { Subscription } from 'rxjs';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';
import { Resourse } from '../../../interfaces/resourse';

@Component({
  selector: 'app-task-data-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './task-data-doctor.component.html',
  styleUrl: './task-data-doctor.component.css'
})
export class TaskDataDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id!: number;
  userId!: number;

  dataTask!: Task;
  dataActivity!: Activity;
  dataResourse!: Resourse;

  taskSubscription!: Subscription;
  taskDataSubscription!: Subscription;
  downloadSubscription!: Subscription;


  constructor(private patientService: PatientPanelDoctorService){}

  ngOnInit(): void {
    this.patientService.dataTaskPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.dataActivity = dataSended.activity;
      this.userId = dataSended.idUser;
      if(dataSended.activity){
        this.chargeData(dataSended.activity);
        this.chargeDataTask(dataSended.activity);
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      activity: {},
      idUser: NaN
    }
    this.patientService.emitDataTaskPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataTaskPanel(data);
    }, 500);
  }

  chargeData = (activity: Activity) => {
    if(activity.id){
      this.taskSubscription = this.patientService.getTasks(activity.id).subscribe({
        next: (res: Task) =>{
          this.dataTask = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeDataTask = (activity: Activity) => {
    if(activity.id){
      this.taskSubscription = this.patientService.getResponseTaskData(this.userId, activity.id).subscribe({
        next: (res: Resourse) =>{
          this.dataResourse = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  downloadFile = (activity: Activity) => {
    if(activity.id){
      this.downloadSubscription = this.patientService.getResponseTask(this.userId, activity.id).subscribe({
        next: (res: Blob) =>{
          const url = URL.createObjectURL(res);
          window.open(url, '_blank');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.taskDataSubscription?.unsubscribe();
    this.downloadSubscription?.unsubscribe();
  }

}

