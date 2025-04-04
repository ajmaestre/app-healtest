import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { SizeList } from '../../../interfaces/sizeList';
import { User } from '../../../interfaces/user';
import { GroupPanelService } from '../group-panel.service';

@Component({
  selector: 'app-group-data',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './group-data.component.html',
  styleUrl: './group-data.component.css'
})
export class GroupDataComponent implements OnInit, OnDestroy{
 
  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataGroup!: Group;

  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countPatientsSubscription!: Subscription;

  constructor(private groupService: GroupPanelService){}

  ngOnInit(): void {
    this.groupService.dataGroupPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.chargeData(dataSended.id);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      id: NaN,
    }
    this.groupService.emitDataGroupPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.groupService.emitDataGroupPanel(data);
    }, 500);
  }

  chargeData = (id: number) => {
    this.groupsSubscription = this.groupService.getGroupById(id).subscribe({
      next: (res: Group) =>{
        this.dataGroup = res;
        this.getMonitorName(this.dataGroup);
        this.getNumPatients(this.dataGroup);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getNumPatients = (group: Group) => {
    if(group?.id){
      this.countPatientsSubscription = this.groupService.getCountPatientInGroup(group.id).subscribe({
        next: (res: SizeList) =>{
          group.num_patients = res.count;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.groupService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          group.monitor_name = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
  }

}
