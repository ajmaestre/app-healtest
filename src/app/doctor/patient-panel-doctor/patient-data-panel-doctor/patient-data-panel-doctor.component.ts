import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupListAddDoctorComponent } from '../group-list-add-doctor/group-list-add-doctor.component';
import { User } from '../../../interfaces/user';
import { Subscription } from 'rxjs';
import { Group } from '../../../interfaces/group';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';
import { ActivityListDoctorComponent } from '../activity-list-doctor/activity-list-doctor.component';
import { TestListDoctorComponent } from '../test-list-doctor/test-list-doctor.component';
import { TestDataDoctorComponent } from '../test-data-doctor/test-data-doctor.component';

@Component({
  selector: 'app-patient-data-panel-doctor',
  standalone: true,
  imports: [
    GroupListAddDoctorComponent,
    TestListDoctorComponent,
    ActivityListDoctorComponent,
    TestDataDoctorComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './patient-data-panel-doctor.component.html',
  styleUrl: './patient-data-panel-doctor.component.css'
})
export class PatientDataPanelDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id: number = 0;
  tab: string = 'test';

  dataUser!: User;

  changeTab: boolean = false;

  patientSubscription!: Subscription;
  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;

  constructor(private patientService: PatientPanelDoctorService){}

  ngOnInit(): void {
    this.patientService.dataPatientPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.id){
        this.id = dataSended.id;
        this.chargeData(dataSended.id);
      }
    });
    this.patientService.loadedPatientPanel$.subscribe((id) => {
      if(id){
        this.id = id;
        this.chargeData(id);
      }
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
    this.id = 0;
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

  getActivities = () =>{
    this.tab = 'act';
    this.changeTab = true;
  }

  getTests = () => {
    this.tab = 'test';
    this.changeTab = false;
  }

  isSelect = (tab: string) => {
    if(this.tab == tab){
      return 'selected';
    }
    return '';
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
    this.id = 0;
    this.patientSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
  }

}

