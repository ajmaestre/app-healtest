import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { User } from '../../../interfaces/user';
import { Subscription } from 'rxjs';
import { Group } from '../../../interfaces/group';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';

@Component({
  selector: 'app-patient-list-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './patient-list-panel-doctor.component.html',
  styleUrl: './patient-list-panel-doctor.component.css'
})
export class PatientListPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countPatients: SizeList = { count: 0 };

  newTitle: string = "Sin pacientes";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  patientList: User[] = [];

  page: string = '';
  pageAdd: string = '';

  patientsSubscription!: Subscription;
  groupsSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  searchPatientSubscription!: Subscription;

  data: FormGroup;

  constructor(private patientService: PatientPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.patientService.patientsLoaded$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
    this.getPatients(this.limit, this.pageSize);
  }

  emiteDataPatientPanel = (patient: User) => {
    if(patient.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: patient.id,
      }
      this.patientService.emitDataPatientPanel(data);
    }
  }

  getPatients = (limit: number, page: number) => {
    this.patientsSubscription = this.patientService.getPatients(limit, page).subscribe({
      next: (res: User[]) =>{
        this.patientList = res;
        this.chargeGroup();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.getCountPatients();
  }

  getCountPatients = () => {
    this.countPatientSubscription = this.patientService.getCountPatients().subscribe({
      next: (res: SizeList) =>{
        this.countPatients = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getPatientsByAll = () => {
    this.searchPatientSubscription = this.patientService.getPatientsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
      next: (res: User[]) =>{
        this.patientList = res;
        this.chargeGroup();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  chargeGroup = () => {
    this.patientList.forEach((element) => {
      this.getGroupByPatient(element)
    });
  }

  getGroupByPatient = (user: User) => {
    if(user.id){
      this.groupsSubscription = this.patientService.getGroupByPatient(user.id).subscribe({
        next: (res: Group) =>{
          if(res){
            user.groups = [res];
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.patientService.emitPatients(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitPatients(data);
    }, 500);
  }

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getPatients(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countPatients.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countPatients?.count){
      this.pageSize += 4; 
      this.getPatients(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getPatients(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.patientsSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
    this.searchPatientSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
  }

}
