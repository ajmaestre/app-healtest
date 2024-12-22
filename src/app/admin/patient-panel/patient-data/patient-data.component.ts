import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { NgFor, NgIf } from '@angular/common';
import { GroupListAddComponent } from '../group-list-add/group-list-add.component';
import { Group } from '../../../interfaces/group';
import { PatientPanelService } from '../patient-panel.service';

@Component({
  selector: 'app-patient-data',
  standalone: true,
  imports: [
    GroupListAddComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './patient-data.component.html',
  styleUrl: './patient-data.component.css'
})
export class PatientDataComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataUser!: User;

  patientSubscription!: Subscription;
  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;

  constructor(private patientService: PatientPanelService){}

  ngOnInit(): void {
    this.patientService.dataPatientPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.chargeData(dataSended.id);
    });
    this.patientService.loadedPatientPanel$.subscribe((id) => {
      this.chargeData(id);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      id: NaN,
    }
    this.patientService.emitDataPatientPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataPatientPanel(data);
    }, 500);
  }

  chargeData = (id: number) => {
    this.patientSubscription = this.patientService.getUserById(id).subscribe({
      next: (res: User) =>{
        this.dataUser = res;
        this.getGroupByPatient(this.dataUser);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupByPatient = (user: User) => {
    if(user.id){
      this.groupsSubscription = this.patientService.getGroupByPatient(user.id).subscribe({
        next: (res: Group) =>{
          if(res){
            user.groups = [res];
            this.getMonitorName(user, res);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getMonitorName = (user: User, group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.patientService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          user.monitor = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  openModalAddPatientInGroup = (patient: User) => {
    if(patient.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: patient.id,
        edit: false,
      }
      this.patientService.emitDataGroupAddPanel(data);
    }
  }

  openModalChangePatientInGroup = (patient: User) => {
    if(patient.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: patient.id,
        edit: true,
      }
      this.patientService.emitDataGroupAddPanel(data);
    }
  }

  ngOnDestroy(): void {
    this.patientSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
  }

}
