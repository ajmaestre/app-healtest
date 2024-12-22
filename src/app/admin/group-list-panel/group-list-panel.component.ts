import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeList } from '../../interfaces/sizeList';
import { Group } from '../../interfaces/group';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin.service';
import { User } from '../../interfaces/user';

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

  limit: number = 3;
  pageSize: number = 0;
  countGroups: SizeList = { count: 0 };

  newTitle: string = "Sin grupos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  groupList: Group[] = [];

  @Input() page: string = '';
  @Input() pageAdd: string = '';
  @Output() closePage = new EventEmitter<{page: string, pageAdd: string}>();

  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  countGroupSubscription!: Subscription;
  searchGroupSubscription!: Subscription;

  data: FormGroup;

  constructor(private adminService: AdminService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getGroups(this.limit, this.pageSize);
  }

  getGroups = (limit: number, page: number) => {
    this.groupsSubscription = this.adminService.getGroups(limit, page).subscribe({
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
    this.searchGroupSubscription = this.adminService.getGroupsByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
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
    });
  }

  getMonitorName = (group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.adminService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          group.monitor_name = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  closeModal = () => {
    this.closePage.emit({page: "div-form-add show", pageAdd: "page-add page-out"});
    setTimeout(() => {
      this.closePage.emit({page: "div-form-add hide", pageAdd: "page-add page-out"});
    }, 500);
  }

  reloadList = () => {
    this.getGroups(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countGroups.count > 3){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 3 < this.countGroups?.count){
      this.pageSize += 3; 
      this.getGroups(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 3; 
      this.getGroups(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
    this.countGroupSubscription?.unsubscribe();
    this.searchGroupSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
  }

}
