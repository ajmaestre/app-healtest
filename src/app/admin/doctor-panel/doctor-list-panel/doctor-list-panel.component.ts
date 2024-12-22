import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '../../../interfaces/user';
import { SizeList } from '../../../interfaces/sizeList';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { Group } from '../../../interfaces/group';
import { DoctorPanelService } from '../doctor-panel.service';

@Component({
  selector: 'app-doctor-list-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './doctor-list-panel.component.html',
  styleUrl: './doctor-list-panel.component.css'
})
export class DoctorListPanelComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countDoctors: SizeList = { count: 0 };

  newTitle: string = "Sin monitores";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  doctorList: User[] = [];

  page: string = '';
  pageAdd: string = '';

  doctorsSubscription!: Subscription;
  groupsSubscription!: Subscription;
  countDoctorSubscription!: Subscription;
  searchDoctorSubscription!: Subscription;

  data: FormGroup;

  constructor(private doctorService: DoctorPanelService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.doctorService.monitorListPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.getDoctors(this.limit, this.pageSize);
    });
  }

  emiteDataDoctorPanel(doctor: User){
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
        this.chargeListGroups();
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
    this.searchDoctorSubscription = this.doctorService.getDoctorsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
      next: (res: User[]) =>{
        this.doctorList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  chargeListGroups = () => {
    this.doctorList.forEach((element) => {
      this.getGroupsByMonitor(element)
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
  
  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.doctorService.emitMonitorListPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.doctorService.emitMonitorListPanel(data);
    }, 500);
  }

  reloadList = () => {
    this.getDoctors(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countDoctors.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countDoctors?.count){
      this.pageSize += 4; 
      this.getDoctors(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getDoctors(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.doctorsSubscription?.unsubscribe();
    this.countDoctorSubscription?.unsubscribe();
    this.searchDoctorSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
  }

}
