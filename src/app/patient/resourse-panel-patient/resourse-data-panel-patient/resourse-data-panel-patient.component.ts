import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Resourse } from '../../../interfaces/resourse';
import { Subscription } from 'rxjs';
import { ResoursePanelPatientService } from '../resourse-panel-patient.service';

@Component({
  selector: 'app-resourse-data-panel-patient',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './resourse-data-panel-patient.component.html',
  styleUrl: './resourse-data-panel-patient.component.css'
})
export class ResourseDataPanelPatientComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataResourse!: Resourse;

  resourseSubscription!: Subscription;
  downloadSubscription!: Subscription;


  constructor(private resourseService: ResoursePanelPatientService){}

  ngOnInit(): void {
    this.resourseService.dataResoursePanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.resourse)
        this.chargeData(dataSended.resourse);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      resourse: {},
    }
    this.resourseService.emitDataResoursePanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resourseService.emitDataResoursePanel(data);
    }, 500);
  }

  chargeData = (dataSended: Resourse) => {
    this.dataResourse = dataSended;
    this.formatDate(this.dataResourse);
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

