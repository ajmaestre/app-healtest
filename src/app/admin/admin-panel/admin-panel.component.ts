import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';
import { SizeList } from '../../interfaces/sizeList';
import { DoctorPanelService } from '../doctor-panel/doctor-panel.service';
import { DoctorListPanelComponent } from '../doctor-panel/doctor-list-panel/doctor-list-panel.component';
import { PatientPanelService } from '../patient-panel/patient-panel.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent  implements OnInit, OnDestroy{

  countDoctorSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  countGroupSubscription!: Subscription;
  countDoctors: SizeList = { count: 0 };
  countPatients: SizeList = { count: 0 };
  countGroups: SizeList = { count: 0 };

  @Output() openListGroup = new EventEmitter<{page: string, pageAdd: string}>();

  constructor(
    private adminService: AdminService,
    private doctorService: DoctorPanelService,
    private patientService: PatientPanelService,
  ){}

  ngOnInit(): void {
    this.getCountDoctors();
    this.getCountPatients();
    this.getCountGroups();
  }

  openPageListDoctor = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.doctorService.emitMonitorListPanel(data);
  }

  openPageListPatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.patientService.emitPatientListPanel(data);
  }

  openPageListGroup = () => {
    this.openListGroup.emit({page: "div-form-add show", pageAdd: "page-add"});
  }

  openPageMonitor = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: {},
      edit: false
    }
    this.doctorService.emitDataDoctor(data);
  }

  openPagePatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: {},
      edit: false
    }
    this.patientService.emitDataPatient(data);
  }

  openPageGroup = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: {},
      edit: false
    }
    this.adminService.emitDataGroup(data);
  }

  getCountDoctors = () => {
    this.countDoctorSubscription = this.doctorService.getCountMonitors().subscribe({
      next: (res: SizeList) =>{
        this.countDoctors = res;
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountGroups = () => {
    this.countGroupSubscription = this.adminService.getCountGroups().subscribe({
      next: (res: SizeList) =>{
        this.countGroups = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.countDoctorSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
    this.countGroupSubscription?.unsubscribe();
  }

}
