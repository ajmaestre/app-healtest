import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SizeList } from '../../interfaces/sizeList';
import { User } from '../../interfaces/user';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { PatientListPanelComponent } from './patient-list-panel/patient-list-panel.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientDataComponent } from './patient-data/patient-data.component';
import { PatientPanelService } from './patient-panel.service';

@Component({
  selector: 'app-patient-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    PatientListPanelComponent,
    AddPatientComponent,
    PatientDataComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './patient-panel.component.html',
  styleUrl: './patient-panel.component.css'
})
export class PatientPanelComponent implements OnInit, OnDestroy{

  limit: number = 4;
  page: number = 0;
  countPatients: SizeList = { count: 0 };

  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin pacientes";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  patientList: User[] = [];

  data: FormGroup;

  patientSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  searchPatientSubscription!: Subscription;
  
  constructor(private patientService: PatientPanelService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.patientService.listPatientLoaded$.subscribe(() => {
      this.getPatients(this.limit, this.page);
    });
    this.confirmService.listPatientLoaded$.subscribe(() => {
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
    this.getPatients(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countPatients.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 4 < this.countPatients?.count){
      this.page += 4; 
      this.getPatients(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 4; 
      this.getPatients(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.patientSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
    this.searchPatientSubscription?.unsubscribe();
  }

}
