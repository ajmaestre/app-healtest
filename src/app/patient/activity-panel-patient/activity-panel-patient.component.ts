import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { Activity } from '../../interfaces/activity';
import { Subscription } from 'rxjs';
import { ActivityPanelPatientService } from './activity-panel-patient.service';
import { Response } from '../../interfaces/response';
import { ActivityResponsePatientComponent } from './activity-response-patient/activity-response-patient.component';
import { CrucigramDataPanelComponent } from './crucigram-data-panel/crucigram-data-panel.component';
import { SoupDataPanelComponent } from './soup-data-panel/soup-data-panel.component';

@Component({
  selector: 'app-activity-panel-patient',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    ActivityResponsePatientComponent,
    CrucigramDataPanelComponent,
    SoupDataPanelComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './activity-panel-patient.component.html',
  styleUrl: './activity-panel-patient.component.css'
})
export class ActivityPanelPatientComponent implements OnInit, OnDestroy{

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
  
  constructor(private activityService: ActivityPanelPatientService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.activityService.listActivityLoaded$.subscribe(() => {
      this.limit = 4;
      this.page = 0;
      this.getActivities(this.limit, this.page);
    });
  }

  openActivityDataPanel = (activity: Activity) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      activity: activity,
    }
    if(activity.state == 'Pendiente'){
      this.activityService.emitDataActivityPanel(data);
    }else if(activity.state == 'Terminada' && activity.type == 'crucigrama'){
      this.activityService.emitDataActivity(data);
    }else if(activity.state == 'Terminada' && activity.type == 'soup'){
      this.activityService.emitDataActivitySoup(data);
    }
  }

  getActivities = (limit: number, page: number) => {
    this.activitySubscription = this.activityService.getActivities(limit, page).subscribe({
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
    this.countSubscription = this.activityService.getCountActivities().subscribe({
      next: (res: SizeList) =>{
        this.countActivities = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getActivitiesByAll = () => {
    this.searchSubscription = this.activityService.getActivitiesByAll(this.data.value.search, this.limit, this.page).subscribe({
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
      this.stateSubscription = this.activityService.getStateActivity(activity.id).subscribe({
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

