import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';

@Component({
  selector: 'app-add-activity-doctor',
  standalone: true,
  imports: [],
  templateUrl: './add-activity-doctor.component.html',
  styleUrl: './add-activity-doctor.component.css'
})
export class AddActivityDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';


  constructor(private activityService: ActivityPanelDoctorService){}

  ngOnInit(): void {
    this.activityService.dataActivitySent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
    }
    this.activityService.emitDataActivity(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataActivity(data);
    }, 500);
  }
  
  openModalAddCrucigrama = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      crucigrama: {},
      edit: false
    }
    this.activityService.emitDataCrucigrama(data);
  }

  openModalAddSopaLetra = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      soup: {},
      edit: false
    }
    this.activityService.emitDataSoup(data);
  }

  ngOnDestroy(): void {}

}
