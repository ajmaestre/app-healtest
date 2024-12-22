import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../interfaces/sizeList';
import { Activity } from '../../interfaces/activity';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { ActivityPanelDoctorService } from './activity-panel-doctor.service';
import { AddActivityDoctorComponent } from './add-activity-doctor/add-activity-doctor.component';
import { AddCrucigramaDoctorComponent } from './add-crucigrama-doctor/add-crucigrama-doctor.component';
import { ActivityDataPanelDoctorComponent } from './activity-data-panel-doctor/activity-data-panel-doctor.component';
import { GroupActivityAddDoctorComponent } from './group-activity-add-doctor/group-activity-add-doctor.component';
import { AddSoupDoctorComponent } from './add-soup-doctor/add-soup-doctor.component';

@Component({
  selector: 'app-activity-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddActivityDoctorComponent,
    AddCrucigramaDoctorComponent,
    AddSoupDoctorComponent,
    ActivityDataPanelDoctorComponent,
    GroupActivityAddDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './activity-panel-doctor.component.html',
  styleUrl: './activity-panel-doctor.component.css'
})
export class ActivityPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  page: number = 0;
  countActivities: SizeList = { count: 0 };

  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin actividades";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  activityList: Activity[] = [];

  data: FormGroup;

  activitySubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  
  constructor(private activityService: ActivityPanelDoctorService, private confirmService: PanelConfirmService){
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
    this.confirmService.listActivityLoaded$.subscribe(() => {
      this.limit = 4;
      this.page = 0;
      this.getActivities(this.limit, this.page);
    });
  }

  openPageConfirm = (activity: Activity) => {
    if(activity.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: activity.id, typeElement: 'activity'});
    }
  }

  chargeDataActivity = (activity: Activity) => {
    if(activity.type == 'crucigrama'){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        crucigrama: activity,
        edit: true
      }
      this.activityService.emitDataCrucigrama(data);
    }else if(activity.type == 'soup'){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        soup: activity,
        edit: true
      }
      this.activityService.emitDataSoup(data);
    }
  }

  openModalAddActivity = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.activityService.emitDataActivity(data);
  }

  openActivityDataPanel = (activity: Activity) => {
    if(activity.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        activity: activity,
      }
      this.activityService.emitDataActivityPanel(data);
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
    });
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
  }

}

