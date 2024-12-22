import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Resourse } from '../../../interfaces/resourse';
import { Subscription } from 'rxjs';
import { ResoursePanelDoctorService } from '../resourse-panel-doctor.service';
import { Group } from '../../../interfaces/group';

@Component({
  selector: 'app-resourse-data-panel-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './resourse-data-panel-doctor.component.html',
  styleUrl: './resourse-data-panel-doctor.component.css'
})
export class ResourseDataPanelDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataResourse!: Resourse;
  listGroups: Group[] = [];

  resourseSubscription!: Subscription;
  downloadSubscription!: Subscription;
  groupsSubscription!: Subscription;


  constructor(private resourseService: ResoursePanelDoctorService){}

  ngOnInit(): void {
    this.resourseService.dataResoursePanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.id)
        this.chargeData(dataSended.id);
    });
    this.resourseService.listGroupLoaded$.subscribe(() => {
      if(this.dataResourse){
        this.getGroupsByResourse(this.dataResourse);
      }
    })
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      id: NaN,
    }
    this.resourseService.emitDataResoursePanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resourseService.emitDataResoursePanel(data);
    }, 500);
  }

  chargeData = (id: number) => {
    this.resourseSubscription = this.resourseService.getDataResourse(id).subscribe({
      next: (res: Resourse) =>{
        this.dataResourse = res;
        this.getGroupsByResourse(this.dataResourse);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupsByResourse = (resourse: Resourse) => {
    if(resourse.id){
      this.groupsSubscription = this.resourseService.getGroupsByRes(resourse.id).subscribe({
        next: (res: Group[]) =>{
          this.listGroups = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  addGroup = () => {
    if(this.dataResourse.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: this.dataResourse.id,
        edit: false
      }
      this.resourseService.emitDataGroupAddPanel(data);
    }
  }

  downloadFile = (resourse: Resourse) => {
    if(resourse.id){
      this.downloadSubscription = this.resourseService.getResourse(resourse.id).subscribe({
        next: (res: Blob) =>{
          const url = URL.createObjectURL(res);
          window.open(url, '_blank');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.resourseSubscription?.unsubscribe();
    this.downloadSubscription?.unsubscribe();
  }

}

