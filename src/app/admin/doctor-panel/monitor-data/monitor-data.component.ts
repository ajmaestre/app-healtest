import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { DoctorPanelService } from '../doctor-panel.service';
import { Group } from '../../../interfaces/group';

@Component({
  selector: 'app-monitor-data',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './monitor-data.component.html',
  styleUrl: './monitor-data.component.css'
})
export class MonitorDataComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataUser!: User;

  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;

  constructor(private doctorService: DoctorPanelService){}

  ngOnInit(): void {
    this.doctorService.dataMonitorPanelSent$.subscribe((dataSended) => {
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
    this.doctorService.emitDataMonitorPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.doctorService.emitDataMonitorPanel(data);
    }, 500);
  }

  chargeData = (id: number) => {
    this.doctorsSubscription = this.doctorService.getUserById(id).subscribe({
      next: (res: User) =>{
        this.dataUser = res;
        this.getGroupsByMonitor(this.dataUser);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupsByMonitor = (user: User) => {
    if(user.id){
      this.groupsSubscription = this.doctorService.getGroupsByMonitor(user.id).subscribe({
        next: (res: Group[]) =>{
          user.groups = res;
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
  }

}
