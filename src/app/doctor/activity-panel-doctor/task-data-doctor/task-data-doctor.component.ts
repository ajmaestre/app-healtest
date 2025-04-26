import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { Activity } from '../../../interfaces/activity';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';

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

  dataTask!: Task;
  dataActivity!: Activity;
  listGroups: Group[] = [];

  taskSubscription!: Subscription;
  groupsSubscription!: Subscription;


  constructor(private activityService: ActivityPanelDoctorService){}

  ngOnInit(): void {
    this.activityService.dataTaskPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.dataActivity = dataSended.task;
      if(dataSended.task)
        this.chargeData(dataSended.task);
    });
    this.activityService.listGroupLoaded$.subscribe(() => {
      if(this.dataActivity){
        this.getGroupsByActivity(this.dataActivity);
      }
    })
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      task: {},
    }
    this.activityService.emitDataTaskPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataTaskPanel(data);
    }, 500);
  }

  chargeData = (activity: Activity) => {
    console.log(activity)
    if(activity.id){
      this.taskSubscription = this.activityService.getTasks(activity.id).subscribe({
        next: (res: Task) =>{
          this.dataTask = res;
          this.getGroupsByActivity(activity);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getGroupsByActivity = (activity: Activity) => {
    if(activity.id){
      this.groupsSubscription = this.activityService.getGroupsInAct(activity.id).subscribe({
        next: (res: Group[]) =>{
          this.listGroups = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  addGroup = () => {
    if(this.dataActivity.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: this.dataActivity.id,
      }
      this.activityService.emitDataGroupAddPanel(data);
    }
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
  }

}

