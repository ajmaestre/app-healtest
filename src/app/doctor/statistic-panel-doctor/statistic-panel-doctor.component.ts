import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { NgFor, NgIf } from '@angular/common';
import { SizeList } from '../../interfaces/sizeList';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StatisticPanelDoctorService } from './statistic-panel-doctor.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { stateCount } from '../../interfaces/responseInterface';
import { ChardCardComponent } from './chard-card/chard-card.component';

@Component({
  selector: 'app-statistic-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    EmptyPageComponent,
    ChardCardComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './statistic-panel-doctor.component.html',
  styleUrl: './statistic-panel-doctor.component.css'
})
export class StatisticPanelDoctorComponent implements OnInit, OnDestroy{

  limit: number = 4;
  page: number = 0;
  countStats: SizeList = { count: 0 };

  monthList: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 
                        'Mayo', 'Junio', 'Julio', 'Agosto', 
                        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  newTitle: string = "Sin estadísticas";
  newMessage: string = "No se encontraron registros almacenados en la base de datos.";

  data: FormGroup;

  statsSubscription!: Subscription;
  statsPatientSubscription!: Subscription;
  statsTestSubscription!: Subscription;
  statsResourseSubscription!: Subscription;
  statsResourseTypeSubscription!: Subscription;
  statsPatientMonthSubscription!: Subscription;

  public graph: typeof Highcharts = Highcharts;
  public graphConfigList: Highcharts.Options[] = [];
  public pageList: Highcharts.Options[] = [];
  public registros: stateCount[] = [];

  graphConfig?: Highcharts.Options;

  
  constructor(private statService: StatisticPanelDoctorService){
    this.data = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.statService.listStatLoaded$.subscribe(() => {
      this.limit = 4;
      this.page = 0;
      this.getStats(this.limit, this.page);
    });
  }

  openStatDataPanel = (graphConfig: Highcharts.Options) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      graphConfig: graphConfig,
    }
    this.statService.emitDataStat(data);
  }

  getStats = (limit: number, page: number) => {
    this.graphConfigList = [];
    this.getCountState(limit, page);
    this.getCountPatient(limit, page);
    this.getCountTest(limit, page);
    this.getCountResourse(limit, page);
    this.getResourseByType(limit, page);
    this.getPatientByMonth(limit, page);
  }

  chargeInList = (limit: number, page: number) => {
    this.pageList = this.graphConfigList.slice(page, limit + page);
    this.getCountStats();
  }

  getCountStats = () => {
    this.countStats.count = this.graphConfigList.length;
  }

  getStatsByAll = () => {
    this.pageList = this.graphConfigList.filter((value, index) => value.title?.text == this.data.value.search).slice(this.page, this.limit);
  }

  private getCountState(limit: number, page: number){
    this.statsSubscription = this.statService.getStatsGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getStateCountChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getCountPatient(limit: number, page: number){
    this.statsPatientSubscription = this.statService.getPatientsGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getPatientCountChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getCountTest(limit: number, page: number){
    this.statsTestSubscription = this.statService.getTestsGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getTestCountChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getCountResourse(limit: number, page: number){
    this.statsResourseTypeSubscription = this.statService.getResoursesGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getResourseCountChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getResourseByType(limit: number, page: number){
    this.statsResourseTypeSubscription = this.statService.getResoursesTypeGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = res;
        this.graphConfigList.push(this.getResourseTypeChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private getPatientByMonth(limit: number, page: number){
    this.statsResourseSubscription = this.statService.getPatientsByMonthGraph().subscribe({
      next: (res: stateCount[]) => {
        this.registros = this.formatDateInList(res);
        this.graphConfigList.push(this.getPatientMonthChart(this.registros));
        this.chargeInList(limit, page);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
 
  private getStateCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'pie', },
      title: { text: 'Distribución de los estados de las evaluaciones por paciente', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      series: [
        {
          type: 'pie',
          name: 'Pacientes',
          data: registros.map((item) => [item.state, Number(item.count)]),
        },
      ],
    };
    return this.graphConfig;
  }

  private getPatientCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de pacientes por grupo', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Grupos', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Pacientes',
          type: 'column',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  private getTestCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de evaluaciones por grupo', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Grupos', style: {fontSize: '.7rem',} },
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

  private getResourseCountChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'column',},
      title: { text: 'Volumen de recursos por grupo', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Grupos', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Recursos',
          type: 'column',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  private getResourseTypeChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'pie',},
      title: { text: 'Distribución de recursos por tipo', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      series: [
        {
          type: 'pie',
          name: 'Tipo',
          data: registros.map((item) => [item.state, Number(item.count)]),
        },
      ],
    };
    return this.graphConfig;
  }

  private getPatientMonthChart(registros: stateCount[]): Highcharts.Options {
    this.graphConfig = {
      chart: { type: 'line',},
      title: { text: 'Pacientes registrados por mes', style: {fontSize: '.7rem',} },
      scrollbar: { enabled: true, },
      xAxis: {
        categories: registros.map((item) => item.state),
        title: { text: 'Meses', style: {fontSize: '.7rem',} },
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad', style: {fontSize: '.7rem',} },
      },
      series: [
        {
          name: 'Pacientes',
          type: 'line',
          data: registros.map((item) => Number(item.count)),
        },
      ],
    };
    return this.graphConfig;
  }

  formatDateInList = (registros: stateCount[]): stateCount[] => {
    registros.forEach((element) => {
      this.formatDate(element);
    });
    return registros;
  }

  formatDate = (registro: stateCount) => {
    if(registro.state){
      const month: number = new Date(registro.state).getMonth();
      registro.state = this.monthList[month];
    }
  }

  reloadList = () => {
    this.limit = 4;
    this.page = 0;
    this.getStats(this.limit, this.page);
  }

  isPages = (): boolean => {
    if(this.countStats.count > 4){
      return true;
    }
    return false;
  }

  nextPage = () => {
    if(this.page + 4 < this.countStats?.count){
      this.page += 4; 
      this.getStats(this.limit, this.page);
    }
  }

  prePage = () => {
    if(this.page > 0){
      this.page -= 4; 
      this.getStats(this.limit, this.page);
    }
  }

  ngOnDestroy(): void {
    this.statsSubscription?.unsubscribe();
    this.statsPatientSubscription?.unsubscribe();
    this.statsTestSubscription?.unsubscribe();
    this.statsResourseSubscription?.unsubscribe();
    this.statsResourseTypeSubscription?.unsubscribe();
    this.statsPatientMonthSubscription?.unsubscribe();
  }

}
