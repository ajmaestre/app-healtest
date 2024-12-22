import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { Group } from '../../../interfaces/group';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';
import { GroupPanelDoctorService } from '../../group-panel-doctor/group-panel-doctor.service';
import { Subscription } from 'rxjs';
import { IsAuth } from '../../../interfaces/isAuth';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-group-activity-add-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-activity-add-doctor.component.html',
  styleUrl: './group-activity-add-doctor.component.css'
})
export class GroupActivityAddDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countGroups: SizeList = { count: 0 };
  
  divWarning: string = 'div-warning hide';
  message:string = '';

  newTitle: string = "Sin grupos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  groupList: Group[] = [];

  page: string = '';
  pageAdd: string = '';
  id!: number;

  listGroupInActs: Group[] = [];

  groupsSubscription!: Subscription;
  groupsInActSubscription!: Subscription;
  saveSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countPatientsSubscription!: Subscription;

  data: FormGroup;

  constructor(private activityService: ActivityPanelDoctorService, private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.activityService.dataGroupAddPanelSent$.subscribe((dataSended) => {
      if(dataSended.id){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.id = dataSended.id;
        this.getGroupsInAct(dataSended.id);
      }else{
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
    this.getGroups(this.limit, this.pageSize);
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      id: NaN,
    }
    this.activityService.emitDataGroupAddPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataGroupAddPanel(data);
    }, 500);
  }

  sendData = () => {
    this.saveGroupAct();
  }

  saveGroupAct = () => {
    this.saveSubscription = this.activityService.saveGroupAct(this.id, this.listGroupInActs).subscribe({
      next: (res: IsAuth) =>{
        if(res.response){
          this.setMessage('Actividad asignada');
        }else{
          this.setMessage('La actividad no pudo ser asignada');
        }
      },
      error: (err: any) => {
        console.log(err);
        this.setMessage('La actividad no pudo ser asignada');
      }
    });
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

  getGroupsInAct = (id: number) => {
    this.groupsInActSubscription = this.activityService.getGroupsInAct(id).subscribe({
      next: (res: Group[]) =>{
        this.listGroupInActs = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountGroups = () => {
    this.countSubscription = this.groupService.getCountGroups().subscribe({
      next: (res: SizeList) =>{
        this.countGroups = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupsByAll = () => {
    this.searchSubscription = this.groupService.getGroupsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
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
      this.getMonitorName(element);
      this.getNumPatients(element);
    });
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.activityService.getProfile().subscribe({
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

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getGroups(this.limit, this.pageSize);
  }

  select = (group: Group) => {
    if(this.listIncludes(group)){
      this.listGroupInActs = this.listGroupInActs.filter((value, index, array) => value.id != group.id);
    }else{
      this.listGroupInActs.push(group);
    }
  }

  classInput = (group: Group) => {
    if(this.listIncludes(group)){
      return 'input active';
    }
    return 'input';
  }

  listIncludes(group: Group): boolean{
    let finded: boolean = false;
    this.listGroupInActs.forEach((element) => {
      if(element.id == group.id){
        finded = true;
      }
    });
    return finded;
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

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.groupsInActSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
  }

}



