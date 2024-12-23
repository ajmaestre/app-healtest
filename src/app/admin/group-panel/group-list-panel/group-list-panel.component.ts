import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../../interfaces/sizeList';
import { Group } from '../../../interfaces/group';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { GroupPanelService } from '../group-panel.service';

@Component({
  selector: 'app-group-list-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './group-list-panel.component.html',
  styleUrl: './group-list-panel.component.css'
})
export class GroupListPanelComponent implements OnInit, OnDestroy{

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

  constructor(private groupService: GroupPanelService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.listGroupPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.getGroups(this.limit, this.pageSize);
    })
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
      this.getNumPatients(element);
      this.getMonitorName(element);
    });
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.groupService.getMonitorById(group.user_id).subscribe({
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
    this.groupService.emitListGroupPanel(data);
    setTimeout(() => {
      const data = {
        page: "div-form-add hide", 
        pageAdd: "page-add page-out", 
      }
      this.groupService.emitListGroupPanel(data);
    }, 500);
  }

  reloadList = () => {
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
