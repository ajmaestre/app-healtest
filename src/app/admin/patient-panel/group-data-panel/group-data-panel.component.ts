import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../../interfaces/group';
import { PatientPanelService } from '../patient-panel.service';

@Component({
  selector: 'app-group-data-panel',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './group-data-panel.component.html',
  styleUrl: './group-data-panel.component.css'
})
export class GroupDataPanelComponent implements OnInit, OnDestroy{
 
  page: string = '';
  pageAdd: string = '';
  id!: number;

  dataGroup!: Group;

  constructor(private patientService: PatientPanelService){}

  ngOnInit(): void {
    this.patientService.dataGroupPanelSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.chargeData(dataSended.group);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      group: {},
    }
    this.patientService.emitDataGroupPanel(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataGroupPanel(data);
    }, 500);
  }

  chargeData = (group: Group) => {
    this.dataGroup = group;
  }

  ngOnDestroy(): void {}

}
