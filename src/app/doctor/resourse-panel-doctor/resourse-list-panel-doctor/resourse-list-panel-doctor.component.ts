import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyPageComponent } from '../../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../../interfaces/sizeList';
import { Resourse } from '../../../interfaces/resourse';
import { Subscription } from 'rxjs';
import { ResoursePanelDoctorService } from '../resourse-panel-doctor.service';

@Component({
  selector: 'app-resourse-list-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './resourse-list-panel-doctor.component.html',
  styleUrl: './resourse-list-panel-doctor.component.css'
})
export class ResourseListPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  pageSize: number = 0;
  countResourses: SizeList = { count: 0 };

  newTitle: string = "Sin recursos";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";
  resourseList: Resourse[] = [];

  page: string = '';
  pageAdd: string = '';

  resoursesSubscription!: Subscription;
  countSubscription!: Subscription;
  searchSubscription!: Subscription;

  data: FormGroup;

  constructor(private resourseService: ResoursePanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.resourseService.resoursesLoaded$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
    this.getResourses(this.limit, this.pageSize);
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
    this.countSubscription = this.resourseService.getCountResourses().subscribe({
      next: (res: SizeList) =>{
        this.countResourses = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getResoursesByAll = () => {
    this.searchSubscription = this.resourseService.getResoursesByAll(this.data.value.search, this.limit, this.pageSize).subscribe({
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

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.resourseService.emitResourses(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resourseService.emitResourses(data);
    }, 500);
  }

  reloadList = () => {
    this.limit = 4;
    this.pageSize = 0;
    this.getResourses(this.limit, this.pageSize);
  }

  isPages = (): boolean => {
    if(this.countResourses.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.pageSize + 4 < this.countResourses?.count){
      this.pageSize += 4; 
      this.getResourses(this.limit, this.pageSize);
    }
  }

  prePage = () => {
    if(this.pageSize > 0){
      this.pageSize -= 4; 
      this.getResourses(this.limit, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.resoursesSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

}
