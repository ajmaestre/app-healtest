import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { SizeList } from '../../../interfaces/sizeList';
import { Group } from '../../../interfaces/group';
import { GroupPanelDoctorService } from '../group-panel-doctor.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-group-list-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-list-panel-doctor.component.html',
  styleUrl: './group-list-panel-doctor.component.css'
})
export class GroupListPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countGroups: SizeList = { count: 0 };

  newTitle: string = "Sin grupos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  groupList: Group[] = [];

  page: string = '';
  pageAdd: string = '';

  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countGroupSubscription!: Subscription;
  searchGroupSubscription!: Subscription;
  countPatientsSubscription!: Subscription;

  data: FormGroup;

  constructor(private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.groupsLoaded$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
    this.getGroups(this.limit, this.pageSize);
  }

  openGroupDataPanel = (group: Group) => {
    if(group.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: group.id,
      }
      this.groupService.emitDataGroupPanel(data);
    }
  }

  getGroups = (limit: number, page: number) => {
    this.groupsSubscription = this.groupService.getGroups(limit, page).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertMonitorInList();
        this.getCountGroups();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountGroups = () => {
    this.countGroupSubscription = this.groupService.getCountGroups().subscribe({
      next: (res: SizeList) =>{
        this.countGroups = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupsByAll = () => {
    this.searchGroupSubscription = this.groupService.getGroupsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertMonitorInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertMonitorInList = () => {
    this.groupList.forEach((element) => {
      this.getMonitorName(element);
      this.getNumPatients(element);
    });
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

  getNumPatients = (group: Group) => {
    if(group?.id){
      this.countPatientsSubscription = this.groupService.getCountPatientInGroup(group.id).subscribe({
        next: (res: SizeList) =>{
          group.num_patients = res.count;
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
    this.groupService.emitGroups(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.groupService.emitGroups(data);
    }, 500);
  }

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getGroups(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countGroups.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countGroups?.count){
      this.pageSize += 4; 
      this.getGroups(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getGroups(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.countGroupSubscription?.unsubscribe();
    this.searchGroupSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
  }

}
