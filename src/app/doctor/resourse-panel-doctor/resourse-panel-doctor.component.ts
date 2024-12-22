import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { Resourse } from '../../interfaces/resourse';
import { Subscription } from 'rxjs';
import { PanelConfirmService } from '../../panel-confirm/panel-confirm.service';
import { ResourseDataPanelDoctorComponent } from './resourse-data-panel-doctor/resourse-data-panel-doctor.component';
import { ResoursePanelDoctorService } from './resourse-panel-doctor.service';
import { AddResourseDoctorComponent } from './add-resourse-doctor/add-resourse-doctor.component';
import { ResourseListPanelDoctorComponent } from './resourse-list-panel-doctor/resourse-list-panel-doctor.component';
import { GroupResourseAddDoctorComponent } from './group-resourse-add-doctor/group-resourse-add-doctor.component';

@Component({
  selector: 'app-resourse-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    ResourseDataPanelDoctorComponent,
    AddResourseDoctorComponent,
    ResourseListPanelDoctorComponent,
    GroupResourseAddDoctorComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './resourse-panel-doctor.component.html',
  styleUrl: './resourse-panel-doctor.component.css'
})
export class ResoursePanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 6;
  page: number = 0;
  countResourses: SizeList = { count: 0 };
  
  @Output() openModalConfirm = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  newTitle: string = "Sin recursos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  resourseList: Resourse[] = [];

  data: FormGroup;

  resoursesSubscription!: Subscription;
  countResourseSubscription!: Subscription;
  searchSubscription!: Subscription;

  
  constructor(private resourseService: ResoursePanelDoctorService, private confirmService: PanelConfirmService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.resourseService.listResourseLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getResourses(this.limit, this.page);
    });
    this.confirmService.listResourseLoaded$.subscribe(() => {
      this.limit = 6;
      this.page = 0;
      this.getResourses(this.limit, this.page);
    });
  }

  openPageConfirm = (resourse: Resourse) => {
    if(resourse.id){
      this.openModalConfirm.emit({page: "div-form-add show", pageAdd: "page-add", elementId: resourse.id, typeElement: 'resourse'});
    }
  }

  chargeDataResourse = (resourse: Resourse) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      resourse: resourse,
      edit: true
    }
    this.resourseService.emitDataResourse(data);
  }

  openModalAddResourse = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      resourse: {},
      edit: false
    }
    this.resourseService.emitDataResourse(data);
  }

  openResourseDataPanel = (resourse: Resourse) => {
    if(resourse.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: resourse.id,
      }
      this.resourseService.emitDataResoursePanel(data);
    }
  }

  getResourses = (limit: number, page: number) => {
    this.resoursesSubscription = this.resourseService.getResourses(limit, page).subscribe({
      next: (res: Resourse[]) =>{
        this.resourseList = res;
        this.formatDateInList();
        this.getCountResourses();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountResourses = () => {
    this.countResourseSubscription = this.resourseService.getCountResourses().subscribe({
      next: (res: SizeList) =>{
        this.countResourses = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getResoursesByAll = () => {
    this.searchSubscription = this.resourseService.getResoursesByAll(this.data.value.search, this.limit, this.page).subscribe({
      next: (res: Resourse[]) =>{
        this.resourseList = res;
        this.formatDateInList();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  formatDateInList = () => {
    this.resourseList.forEach((element) => {
      this.formatDate(element);
    });
  }

  formatDate = (resourse: Resourse) => {
    if(resourse.created_at){
      resourse.created_at = new Date(resourse.created_at);
    }
  }

  getDate(resourse: Resourse){
    if(resourse.created_at?.getMonth())
      return `${resourse.created_at?.getFullYear()}/${resourse.created_at?.getMonth()+1}/${resourse.created_at?.getDate()}`;
    return `${resourse.created_at?.getFullYear()}/${resourse.created_at?.getMonth()}/${resourse.created_at?.getDate()}`;
  }

  reloadList = () => {
    this.limit = 6;
    this.page = 0;
    this.getResourses(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countResourses.count > 6){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 6 < this.countResourses?.count){
      this.page += 6; 
      this.getResourses(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 6; 
      this.getResourses(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.resoursesSubscription?.unsubscribe();
    this.countResourseSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

}
