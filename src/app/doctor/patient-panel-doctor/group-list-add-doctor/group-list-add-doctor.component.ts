import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../../interfaces/sizeList';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { IsAuth } from '../../../interfaces/isAuth';
import { User } from '../../../interfaces/user';
import { GroupPanelDoctorService } from '../../group-panel-doctor/group-panel-doctor.service';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';

@Component({
  selector: 'app-group-list-add-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-list-add-doctor.component.html',
  styleUrl: './group-list-add-doctor.component.css'
})
export class GroupListAddDoctorComponent implements OnInit, OnDestroy{

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

  groupSelected!: Group;

  groupsSubscription!: Subscription;
  saveGroupSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countGroupSubscription!: Subscription;
  searchGroupSubscription!: Subscription;
  selectSubscription!: Subscription;
  countPatientsSubscription!: Subscription;

  data: FormGroup;

  constructor(private patientService: PatientPanelDoctorService, private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.patientService.dataGroupAddPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.id = dataSended.id;
      this.edit = dataSended.edit;
      if(dataSended.id)
        this.getGroupByPatient(dataSended.id);
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
    this.patientService.emitDataGroupAddPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataGroupAddPanel(data);
    }, 500);
  }

  sendData = () => {
    this.updateGroupPatient();
  }

  updateGroupPatient = () => {
    if(this.groupSelected?.id){
      this.saveGroupSubscription = this.patientService.updateGroupPatient(this.id, this.groupSelected.id).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Grupo actualizado');
          }
          this.chargeListGroups(this.id);
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('El grupo no pudo ser actualizado');
        }
      });
    }else{
      this.setMessage('Debe seleccionar un grupo');
    }
  }

  chargeListGroups = (id: number) => {
      this.patientService.emitLoadPatientListPanel(id);
  }

  getGroups = (limit: number, page: number) => {
    this.groupsSubscription = this.groupService.getGroups(limit, page).subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
        this.insertMonitorInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.getCountPatients();
  }

  getCountPatients = () => {
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

  getGroupByPatient = (id: number) => {
    if(id){
      this.selectSubscription = this.patientService.getGroupByPatient(id).subscribe({
        next: (res: Group) =>{
          if(res){
            this.select(res);
          }
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
      this.doctorsSubscription = this.patientService.getProfile().subscribe({
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

  select(group: Group) {
    this.groupSelected = group;
  }

  classInput = (group: Group) => {
    if(group?.id == this.groupSelected?.id){
      return 'input active';
    }
    return 'input';
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
    this.saveGroupSubscription?.unsubscribe();
    this.countGroupSubscription?.unsubscribe();
    this.searchGroupSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.selectSubscription?.unsubscribe();
    this.countPatientsSubscription?.unsubscribe();
  }

}

