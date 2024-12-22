import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrucigramPanelPatientComponent } from '../crucigram-panel-patient/crucigram-panel-patient.component';
import { SoupPanelPatientComponent } from '../soup-panel-patient/soup-panel-patient.component';
import { NgIf } from '@angular/common';
import { Activity } from '../../../interfaces/activity';
import { ActivityPanelPatientService } from '../activity-panel-patient.service';

@Component({
  selector: 'app-activity-response-patient',
  standalone: true,
  imports: [
    CrucigramPanelPatientComponent,
    SoupPanelPatientComponent,
    NgIf,
  ],
  templateUrl: './activity-response-patient.component.html',
  styleUrl: './activity-response-patient.component.css'
})
export class ActivityResponsePatientComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  dataActivity!: Activity;

  activityData: Activity = {};


  constructor(private activityService: ActivityPanelPatientService){}

  ngOnInit(): void {
    this.activityService.dataActivityPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.activity)
        this.chargeData(dataSended.activity);
    });
  }

  loadActivityData(data: {activity: Activity}) {
    this.activityData = data.activity;
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      activity: {},
    }
    this.activityService.emitDataActivityPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataActivityPanel(data);
    }, 500);
  }

  chargeData = (dataSended: Activity) => {
    this.dataActivity = dataSended;
    const data = {
      activity: this.dataActivity
    }
    this.loadActivityData(data);
  }

  ngOnDestroy(): void {}

}

