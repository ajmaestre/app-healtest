import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity } from '../../../interfaces/activity';
import { Crucigram } from '../../../interfaces/crucigram';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';

@Component({
  selector: 'app-activity-data-panel-doctor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './activity-data-panel-doctor.component.html',
  styleUrl: './activity-data-panel-doctor.component.css'
})
export class ActivityDataPanelDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  cucigramSubscription!: Subscription;

  dataActivity: Activity = {};
  dataCrucigram: Crucigram = {};
  listVertical: Crucigram[] = [];
  listHorizontal: Crucigram[] = [];
  numberCells: string[] = [];
  listWord: Crucigram[] = [];
  listCellFilled: number[] = []


  constructor(private activityService: ActivityPanelDoctorService){}

  ngOnInit(): void {
    this.createListCell();
    this.createList();
    this.activityService.dataActivityPanelSent$.subscribe((dataSended) => {
      if(dataSended.activity){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.activity);
        this.chargeCrucigram(dataSended.activity);
      }else{
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
  }

  createList() {
    for(let i = 0; i < 10; i++){
      this.listHorizontal.push({})
      this.listVertical.push({})
    }
  }

  createListCell() {
    for(let i = 0; i < 100; i++){
      this.numberCells[i] = '';
    }
  }

  getInput(indexLetter: number, cell: string): string{
    if(this.dataActivity.type == 'soup' && this.listCellFilled.includes(indexLetter)){
      return 'input filled-soup';
    }else if(this.dataActivity.type == 'crucigrama' && cell == '*'){
      return 'input filled';
    }
    return 'input';
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

  chargeData(dataSended: Activity){ 
    this.dataActivity = dataSended;
    this.formatDate(this.dataActivity);
  }

  formatDate = (activity: Activity) => {
    if(activity.created_at){
      activity.created_at = new Date(activity.created_at);
    }
  }

  getDate(activity: Activity){
    if(activity.created_at?.getMonth())
      return `${activity.created_at?.getFullYear()}/${activity.created_at?.getMonth()+1}/${activity.created_at?.getDate()}`;
    return `${activity.created_at?.getFullYear()}/${activity.created_at?.getMonth()}/${activity.created_at?.getDate()}`;
  }

  chargeCrucigram(dataSended: Activity){
    if(dataSended.id){
      this.cucigramSubscription = this.activityService.getCrucigrams(dataSended.id).subscribe({
        next: (res: Crucigram[]) => {
          const listRes = res;
          this.listHorizontal = listRes.filter((value, index) => value.position == 'Horizontal');
          this.listVertical = listRes.filter((value, index) => value.position == 'Vertical');
          this.listWord = [...this.listHorizontal.filter((value, index) => value.question != undefined), ...this.listVertical.filter((value, index) => value.question != undefined)];
          this.chargeTable();
        },
        error: (err: any) => {
          console.log(err)
        }
      });
    }
  }

  getTableFilled(word: string, answer: string, indexLetter: number, position: string){
    const indexArray: number[] = [];
    word = word.toLowerCase();
    word.split('').forEach((value, ind) => {
      answer.split('').forEach((char, index) => {
        char = char.toLowerCase();
        if(value == char && indexArray.length == 0 && answer[index+1] == word[ind+1]){
          indexArray.push(index);
          return;
        }else if(value == char && indexArray[indexArray.length-1] + 1 == index){
          indexArray.push(index);
          return;
        }
      });
    });
    if(word.split('').length == indexArray.length){
      if(position == 'Horizontal'){
        indexArray.forEach((value, index, array) => this.listCellFilled.push((10*indexLetter)+value));
      }else if(position == 'Vertical'){
        indexArray.forEach((value, index, array) => this.listCellFilled.push((10*value)+indexLetter));
      }
    }
  }

  chargeTable(){
    this.listHorizontal.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined && value.position != undefined){
        for(let i = 0; i < value.answer.length; i++){
          this.numberCells[(10*value.index)+i] = value.answer[i];
        }
        if(value.question != undefined && this.dataActivity.type == 'soup')
          this.getTableFilled(value.question, value.answer, value.index, value.position);
      }
    });
    this.listVertical.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined && value.position != undefined){
        for(let i = 0; i < value.answer.length; i++){
          this.numberCells[(10*i)+value.index] = value.answer[i];
        }
        if(value.question != undefined && this.dataActivity.type == 'soup')
          this.getTableFilled(value.question, value.answer, value.index, value.position);
      }
    });
  }

  sendData = () => {
    if(this.dataActivity.id){
      const data = {
        page: "div-form-add show", 
        pageAdd: "page-add", 
        id: this.dataActivity.id,
      }
      this.activityService.emitDataGroupAddPanel(data);
    }
  }

  ngOnDestroy(): void {
    this.cucigramSubscription?.unsubscribe();
  }

}

