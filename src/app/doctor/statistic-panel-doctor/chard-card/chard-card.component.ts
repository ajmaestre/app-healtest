import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { StatisticPanelDoctorService } from '../statistic-panel-doctor.service';

@Component({
  selector: 'app-chard-card',
  standalone: true,
  imports: [
    HighchartsChartModule,
  ],
  templateUrl: './chard-card.component.html',
  styleUrl: './chard-card.component.css'
})
export class ChardCardComponent implements OnInit, OnDestroy{

  public graph: typeof Highcharts = Highcharts;
  public graphConfig!: Highcharts.Options;
  
  page: string = '';
  pageAdd: string = '';

  
  constructor(private statService: StatisticPanelDoctorService){}

  ngOnInit(): void {
    this.statService.dataStatSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.graphConfig)
        this.getGraphChart(dataSended.graphConfig);
    });
  }

  private getGraphChart(graphConfig: Highcharts.Options){  
    if(graphConfig.series){
      this.graphConfig = {
        chart: { type: graphConfig.chart?.type, scrollablePlotArea: { minWidth: 300, scrollPositionX: 1, },},
        title: { text: graphConfig.title?.text },
        scrollbar: { enabled: true, },
        xAxis: {...graphConfig.xAxis},
        yAxis: {...graphConfig.yAxis},
        series: [
            ...graphConfig.series
        ],
      };
    }
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      graphConfig: {}
    }
    this.statService.emitDataStat(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.statService.emitDataStat(data);
    }, 500);
  }
  
  ngOnDestroy(): void {}

}
