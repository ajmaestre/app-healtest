import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { Group } from '../../interfaces/group';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { User } from '../../interfaces/user';
import { AddGroupDoctorComponent } from './add-group-doctor/add-group-doctor.component';
import { GroupPanelDoctorService } from './group-panel-doctor.service';
import { GroupDataPanelDoctorComponent } from './group-data-panel-doctor/group-data-panel-doctor.component';
import { GroupListPanelDoctorComponent } from './group-list-panel-doctor/group-list-panel-doctor.component';
import { GroupPatientAddDoctorComponent } from './group-patient-add-doctor/group-patient-add-doctor.component';

@Component({
  selector: 'app-group-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    AddGroupDoctorComponent,
    GroupDataPanelDoctorComponent,
    GroupListPanelDoctorComponent,
    GroupPatientAddDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-panel-doctor.component.html',
  styleUrl: './group-panel-doctor.component.css'
})
export class GroupPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countGroups: SizeList = { count: 0 };

  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin grupos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  groupList: Group[] = [];

  data: FormGroup;

  groupsSubscription!: Subscription;
  countGroupSubscription!: Subscription;
  nameMonitorSubscription!: Subscription;
  countPatientsSubscription!: Subscription;
  searchGroupSubscription!: Subscription;
  
  constructor(private groupService: GroupPanelDoctorService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.listGroupLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getGroups(this.limit, this.page);
    });
    this.confirmService.listGroupLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getGroups(this.limit, this.page);
    });
  }

  openPageConfirm = (group: Group) => {
    if(group.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: group.id, typeElement: 'group'});
    }
  }

  chargeDataGroup = (group: Group) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: group,
      edit: true
    }
    this.groupService.emitDataGroup(data);
  }

  openModalAddGroup = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: {},
      edit: false
    }
    this.groupService.emitDataGroup(data);
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
        this.insertInList();
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
    this.searchGroupSubscription = this.groupService.getGroupsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertInList = () => {
    this.groupList.forEach((element) => {
      this.getNumPatients(element);
      this.getMonitorName(element);
    });
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

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.nameMonitorSubscription = this.groupService.getProfile().subscribe({
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
    this.limit = 6;
    this.page = 0;
    this.getGroups(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countGroups.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countGroups?.count){
      this.page += 6; 
      this.getGroups(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getGroups(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.countGroupSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
    this.nameMonitorSubscription?.unsubscribe();
    this.searchGroupSubscription?.unsubscribe();
  }

}
