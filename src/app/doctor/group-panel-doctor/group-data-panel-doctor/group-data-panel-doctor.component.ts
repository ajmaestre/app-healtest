import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { SizeList } from '../../../interfaces/sizeList';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { GroupPanelDoctorService } from '../group-panel-doctor.service';

@Component({
  selector: 'app-group-data-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './group-data-panel-doctor.component.html',
  styleUrl: './group-data-panel-doctor.component.css'
})
export class GroupDataPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countPatients: SizeList = { count: 0 };

  newTitle: string = "Sin pacientes";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  patientList: User[] = [];

  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataGroup!: Group;

  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countPatientsSubscription!: Subscription;
  patientsSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  searchPatientSubscription!: Subscription;

  data: FormGroup;

  constructor(private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.dataGroupPanelSent$.subscribe((dataSended) => {
      this.pageSize = 0;
      if(dataSended.id){
        this.limit = 4;
        this.pageSize = 0;
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.id);
        this.getPatients(dataSended.id, this.limit, this.pageSize);
      }else{
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
    this.groupService.listPatientLoaded$.subscribe((dataSended) => {
      this.pageSize = 0;
      if(dataSended.id){
        this.limit = 4;
        this.pageSize = 0;
        this.chargeData(dataSended.id);
        this.getPatients(dataSended.id, this.limit, this.pageSize);
      }
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

  openModalAddPatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: this.dataGroup
    }
    this.groupService.emitDataPatient(data);
  }

  getPatients = (id: number, limit: number, page: number) => {
    this.patientsSubscription = this.groupService.getPatientsByGroup(id, limit, page).subscribe({
      next: (res: User[]) =>{
        this.patientList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getPatientsByAll = () => {
    if(this.dataGroup.id){
      this.searchPatientSubscription = this.groupService.getPatientsAndGroupByAll(this.dataGroup.id, this.data.value.search, this.limit, this.pageSize).subscribe({
        next: (res: User[]) =>{
          this.patientList = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
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
          this.countPatients = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.groupService.getProfile().subscribe({
        next: (res: User) =>{
          group.monitor_name = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  reloadList = () => {
    if(this.dataGroup.id){
      this.limit = 4;
      this.pageSize = 0;
      this.getPatients(this.dataGroup.id, this.limit, this.pageSize);
    }
  }

  isPages = (): boolean => {
    if(this.countPatients.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if((this.pageSize + 4 < this.countPatients?.count) && this.dataGroup.id){
      this.pageSize += 4; 
      this.getPatients(this.dataGroup.id, this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0 && this.dataGroup.id){
      this.pageSize -= 4; 
      this.getPatients(this.dataGroup.id, this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
    this.patientsSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
    this.searchPatientSubscription?.unsubscribe();
  }

}
