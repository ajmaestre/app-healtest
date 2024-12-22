import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { ResoursePanelDoctorService } from '../resourse-panel-doctor.service';
import { IsAuth } from '../../../interfaces/isAuth';
import { User } from '../../../interfaces/user';
import { GroupPanelDoctorService } from '../../group-panel-doctor/group-panel-doctor.service';

@Component({
  selector: 'app-group-resourse-add-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-resourse-add-doctor.component.html',
  styleUrl: './group-resourse-add-doctor.component.css'
})
export class GroupResourseAddDoctorComponent implements OnInit, OnDestroy{

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
  edit!: boolean;

  listGroupInResourse: Group[] = [];

  groupsSubscription!: Subscription;
  groupsInResSubscription!: Subscription;
  saveSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countPatientsSubscription!: Subscription;

  data: FormGroup;

  constructor(private resourseService: ResoursePanelDoctorService, private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.resourseService.dataGroupAddPanelSent$.subscribe((dataSended) => {
      if(dataSended.id){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.id = dataSended.id;
        this.edit = dataSended.edit;
        this.getGroupsInRes(dataSended.id);
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
      edit: false,
    }
    this.resourseService.emitDataGroupAddPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resourseService.emitDataGroupAddPanel(data);
    }, 500);
  }

  sendData = () => {
    this.saveGroupRes();
  }

  saveGroupRes = () => {
    if(this.listGroupInResourse.length){
      this.saveSubscription = this.resourseService.saveGroupResourse(this.id, this.listGroupInResourse).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Recurso asignado');
            this.emitLoadGroupList();
          }
        },
        error: (err: any) => {
          this.setMessage('El recurso no pudo ser asignado');
        }
      });
    }else{
      this.setMessage('Debe seleccionar un grupo');
    }
  }

  emitLoadGroupList(){
    this.resourseService.emitLoadGroupList();
  }

  getGroups = (limit: number, page: number) => {
    this.groupsSubscription = this.resourseService.getGroups(limit, page).subscribe({
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

  getGroupsInRes = (id: number) => {
    this.groupsInResSubscription = this.resourseService.getGroupsInRes(id).subscribe({
      next: (res: Group[]) =>{
        this.listGroupInResourse = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountGroups = () => {
    this.countSubscription = this.resourseService.getCountGroups().subscribe({
      next: (res: SizeList) =>{
        this.countGroups = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupsByAll = () => {
    this.searchSubscription = this.resourseService.getGroupsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
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
      this.doctorsSubscription = this.resourseService.getProfile().subscribe({
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
    this.limit = 4;
    this.pageSize = 0;
    this.getGroups(this.limit, this.pageSize);
  }

  select = (group: Group) => {
    if(this.listIncludes(group)){
      this.listGroupInResourse = this.listGroupInResourse.filter((value, index, array) => value.id != group.id);
    }else{
      this.listGroupInResourse.push(group);
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
    this.listGroupInResourse.forEach((element) => {
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
    this.groupsInResSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
  }

}


