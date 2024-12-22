import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group } from '../../interfaces/group';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';
import { SizeList } from '../../interfaces/sizeList';
import { User } from '../../interfaces/user';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';

@Component({
  selector: 'app-group-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-panel.component.html',
  styleUrl: './group-panel.component.css'
})
export class GroupPanelComponent implements OnInit, OnDestroy{

  limit: number = 4;
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
  
  constructor(private adminService: AdminService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.adminService.listGroupLoaded$.subscribe(() => {
      this.getGroups(this.limit, this.page);
    });
    this.confirmService.listGroupLoaded$.subscribe(() => {
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
    this.adminService.emitDataGroup(data);
  }

  openModalAddGroup = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: {},
      edit: false
    }
    this.adminService.emitDataGroup(data);
  }

  openGroupDataPanel = (group: Group) => {
    if(group.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: group.id,
      }
      this.adminService.emitDataGroupPanel(data);
    }
  }

  getGroups = (limit: number, page: number) => {
    this.groupsSubscription = this.adminService.getGroups(limit, page).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertMonitorInList();
        this.insertNumPatientsInList();
        this.getCountGroups();
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

  getGroupsByAll = () => {
    this.searchGroupSubscription = this.adminService.getGroupsByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertMonitorInList();
        this.insertNumPatientsInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  insertNumPatientsInList = () => {
    this.groupList.forEach((element) => {
      this.getNumPatients(element);
    });
  }

  getNumPatients = (group: Group) => {
    if(group?.id){
      this.countPatientsSubscription = this.adminService.getCountPatientInGroup(group.id).subscribe({
        next: (res: SizeList) =>{
          group.num_patients = res.count;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  insertMonitorInList = () => {
    this.groupList.forEach((element) => {
      this.getMonitorName(element);
    });
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.nameMonitorSubscription = this.adminService.getMonitorById(group.user_id).subscribe({
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
    this.getGroups(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countGroups.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 4 < this.countGroups?.count){
      this.page += 4; 
      this.getGroups(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 4; 
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
