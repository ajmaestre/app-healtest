import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { User } from '../../interfaces/user';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SizeList } from '../../interfaces/sizeList';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { DoctorPanelService } from './doctor-panel.service';
import { AddMonitorComponent } from './add-monitor/add-monitor.component';
import { MonitorDataComponent } from './monitor-data/monitor-data.component';
import { DoctorListPanelComponent } from './doctor-list-panel/doctor-list-panel.component';

@Component({
  selector: 'app-doctor-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddMonitorComponent,
    MonitorDataComponent,
    DoctorListPanelComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.css'
})
export class DoctorPanelComponent implements OnInit, OnDestroy{

  limit: number = 4;
  page: number = 0;
  countDoctors: SizeList = { count: 0 };
  
  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin monitores";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  doctorList: User[] = [];

  data: FormGroup;

  doctorsSubscription!: Subscription;
  countDoctorSubscription!: Subscription;
  searchDoctorSubscription!: Subscription;
  
  constructor(private doctorService: DoctorPanelService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.doctorService.listDoctorLoaded$.subscribe(() => {
      this.getDoctors(this.limit, this.page);
    });
    this.confirmService.listDoctorLoaded$.subscribe(() => {
      this.getDoctors(this.limit, this.page);
    });
  }

  openPageConfirm = (doctor: User) => {
    if(doctor.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: doctor.id, typeElement: 'doctor'});
    }
  }

  chargeDataDoctor = (doctor: User) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: doctor,
      edit: true
    }
    this.doctorService.emitDataDoctor(data);
  }

  openModalAddDoctor = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: {},
      edit: false
    }
    this.doctorService.emitDataDoctor(data);
  }

  emiteDataMonitorPanel = (doctor: User) => {
    if(doctor.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: doctor.id,
      }
      this.doctorService.emitDataMonitorPanel(data);
    }
  }

  getDoctors = (limit: number, page: number) => {
    this.doctorsSubscription = this.doctorService.getMonitors(limit, page).subscribe({
      next: (res: User[]) =>{
        this.doctorList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.getCountDoctors();
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

  getDoctorsByAll = () => {
    this.searchDoctorSubscription = this.doctorService.getDoctorsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: User[]) =>{
        this.doctorList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  reloadList = () => {
    this.getDoctors(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countDoctors.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 4 < this.countDoctors?.count){
      this.page += 4; 
      this.getDoctors(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 4; 
      this.getDoctors(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.doctorsSubscription?.unsubscribe();
    this.countDoctorSubscription?.unsubscribe();
    this.searchDoctorSubscription?.unsubscribe();
  }

}
