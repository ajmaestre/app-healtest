import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { PatientPanelDoctorService } from './patient-panel-doctor.service';
import { AddPatientDoctorComponent } from './add-patient-doctor/add-patient-doctor.component';
import { GroupListAddDoctorComponent } from './group-list-add-doctor/group-list-add-doctor.component';
import { PatientDataPanelDoctorComponent } from './patient-data-panel-doctor/patient-data-panel-doctor.component';
import { PatientListPanelDoctorComponent } from './patient-list-panel-doctor/patient-list-panel-doctor.component';

@Component({
  selector: 'app-patient-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddPatientDoctorComponent,
    GroupListAddDoctorComponent,
    PatientDataPanelDoctorComponent,
    PatientListPanelDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './patient-panel-doctor.component.html',
  styleUrl: './patient-panel-doctor.component.css'
})
export class PatientPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countPatients: SizeList = { count: 0 };

  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin pacientes";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  patientList: User[] = [];

  data: FormGroup;

  patientSubscription!: Subscription;
  deleteSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  searchPatientSubscription!: Subscription;
  
  constructor(private patientService: PatientPanelDoctorService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.patientService.listPatientLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getPatients(this.limit, this.page);
    });
    this.confirmService.listPatientLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getPatients(this.limit, this.page);
    });
  }

  openPageConfirm = (patient: User) => {
    if(patient.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: patient.id, typeElement: 'patient'});
    }
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

  chargeDataPatient = (patient: User) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: patient,
      edit: true
    }
    this.patientService.emitDataPatient(data);
  }

  openModalAddPatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: {},
      edit: false
    }
    this.patientService.emitDataPatient(data);
  }

  getPatients = (limit: number, page: number) => {
    this.patientSubscription = this.patientService.getPatients(limit, page).subscribe({
      next: (res: User[]) =>{
        this.patientList = res;
        this.getCountPatients();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountPatients = () => {
    this.countPatientSubscription = this.patientService.getCountPatients().subscribe({
      next: (res: SizeList) =>{
        this.countPatients = res;
        this.isPages();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getPatientsByAll = () => {
    this.searchPatientSubscription = this.patientService.getPatientsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: User[]) =>{
        this.patientList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  reloadList = () => {
    this.limit = 6;
    this.page = 0;
    this.getPatients(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countPatients.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countPatients?.count){
      this.page += 6; 
      this.getPatients(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getPatients(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.patientSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
  }

}
 