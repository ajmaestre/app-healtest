import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { EmptyPageComponent } from '../../../../empty-page/empty-page.component';
import { SizeList } from '../../../../interfaces/sizeList';
import { PatientPanelDoctorService } from '../../patient-panel-doctor.service';
import { Subscription } from 'rxjs';
import { stateCount } from '../../../../interfaces/responseInterface';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    HighchartsChartModule,
    EmptyPageComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, OnDestroy{

  @Input() idUser: number = 0;
  
  page: number = 0;
  countStats: SizeList = { count: 0 };
    
  statsTestSubscription!: Subscription;
  statsActSubscription!: Subscription;
  statsActTypeSubscription!: Subscription;

  public graph: typeof Highcharts = Highcharts;
  public graphConfigList: Highcharts.Options[] = [];
  public registros: stateCount[] = [];
  
  graphConfig!: Highcharts.Options;
  public config?: Highcharts.Options;

  constructor(private patientService: PatientPanelDoctorService){}

  ngOnInit(): void {
    this.getStats();
  }

  getStats = () => {
    this.graphConfigList = [];
    this.getCountTest();
    this.getCountAct();
    this.getActByType();
  }

  chargeInList = (page: number) => {
    this.config = this.graphConfigList.at(page);
  }

  private getCountTest(){
    this.statsTestSubscription = this.patientService.getTestByPatient(this.idUser).subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getTestCountChart(this.registros));
        this.chargeInList(0);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getTestCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de evaluaciones por estado', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Estado', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Evaluaciones',
          type: 'column',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  private getCountAct(){
    this.statsActSubscription = this.patientService.getActByPatient(this.idUser).subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getActCountChart(this.registros));
        this.chargeInList(0);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getActCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de actividades por estado', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Estado', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Actividades',
          type: 'column',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  private getActByType(){
    this.statsActTypeSubscription = this.patientService.getTypeActByPatient(this.idUser).subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getActTypeCountChart(this.registros));
        this.chargeInList(0);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getActTypeCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de actividades por tipo', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Tipo', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Actividades',
          type: 'column',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  nextPage = () => {
    if(this.page + 1 < this.graphConfigList.length){
      this.page += 1; 
      this.chargeInList(this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 1; 
      this.chargeInList(this.page);
    }
  }

  ngOnDestroy(): void {
    this.statsTestSubscription?.unsubscribe();
    this.statsActSubscription?.unsubscribe();
    this.statsActTypeSubscription?.unsubscribe();
  }

}
