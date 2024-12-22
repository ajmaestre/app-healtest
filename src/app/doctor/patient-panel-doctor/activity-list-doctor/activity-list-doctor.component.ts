import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { Activity } from '../../../interfaces/activity';
import { Subscription } from 'rxjs';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';
import { Response } from '../../../interfaces/response';
import { ActivityDataDoctorComponent } from '../activity-data-doctor/activity-data-doctor.component';
import { SoupDataDoctorComponent } from '../soup-data-doctor/soup-data-doctor.component';

@Component({
  selector: 'app-activity-list-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    ActivityDataDoctorComponent,
    SoupDataDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './activity-list-doctor.component.html',
  styleUrl: './activity-list-doctor.component.css'
})
export class ActivityListDoctorComponent implements OnInit, OnDestroy{

  @Input() idUser: number = 0;

  limit: number = 4;
  page: number = 0;
  countActivities: SizeList = { count: 0 };

  newTitle: string = "Sin actividades";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  activityList: Activity[] = [];

  data: FormGroup;

  activitySubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  stateSubscription!: Subscription;
  
  constructor(private patientService: PatientPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.activityList = [];
    this.limit = 4;
    this.page = 0;
    if(this.idUser)
      this.getActivities(this.limit, this.page);
  }
  
  openActivityDataPanel = (activity: Activity) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      activity: activity,
      idUser: this.idUser
    }
    if(activity.type == 'soup'){
      this.patientService.emitDataSoupPanel(data);
    }else if(activity.type == 'crucigrama'){
      this.patientService.emitDataActPanel(data);
    }
  }

  getActivities = (limit: number, page: number) => {
    this.activitySubscription = this.patientService.getActivities(this.idUser, limit, page).subscribe({
      next: (res: Activity[]) =>{
        this.activityList = res;
        this.insertInList();
        this.getCountActivities();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountActivities = () => {
    this.countSubscription = this.patientService.getCountActivities(this.idUser).subscribe({
      next: (res: SizeList) =>{
        this.countActivities = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getActivitiesByAll = () => {
    this.searchSubscription = this.patientService.getActivitiesByAll(this.idUser, this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Activity[]) =>{
        this.activityList = res;
        this.insertInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertInList = () => {
    this.activityList.forEach((element) => {
      this.formatDate(element);
      this.getState(element);
    });
  }

  getState = (activity: Activity) => {
    if(activity.id){
      this.stateSubscription = this.patientService.getStateActivity(this.idUser, activity.id).subscribe({
        next: (res: Response) =>{
          if(res){
            activity.state = res.response;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
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

  reloadList = () => {
    this.limit = 4;
    this.page = 0;
    this.getActivities(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countActivities.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 4 < this.countActivities?.count){
      this.page += 4; 
      this.getActivities(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 4; 
      this.getActivities(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.activitySubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }

}
