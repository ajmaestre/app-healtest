import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity } from '../../../interfaces/activity';
import { Crucigram } from '../../../interfaces/crucigram';
import { ActivityPanelPatientService } from '../activity-panel-patient.service';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-soup-panel-patient',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './soup-panel-patient.component.html',
  styleUrl: './soup-panel-patient.component.css'
})
export class SoupPanelPatientComponent implements OnInit, OnDestroy{

  divWarning: string = 'div-warning hide';
  message:string = '';

  saveSubscription!: Subscription;
  cucigramSubscription!: Subscription;

  @Input() dataSended: Activity = {};
  dataActivity: Activity = {};
  dataCrucigram: Crucigram = {};
  listWord: Crucigram[] = [];
  listVertical: Crucigram[] = [];
  listHorizontal: Crucigram[] = [];
  listVerticalAnswer: Crucigram[] = [];
  listHorizontalAnswer: Crucigram[] = [];
  numberCells: string[] = [];
  letterList: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'J', 'L', 
    'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y'
  ];
  listCellFilled: number[] = []


  constructor(private activityService: ActivityPanelPatientService){}

  ngOnInit(): void {
    this.createListCell();
    this.createList();
    if(this.dataSended.id)
      this.chargeData();
  }

  createList() {
    this.listWord = [];
    this.listHorizontal = [];
    this.listVertical = [];
    for(let i = 0; i < 10; i++){
      this.listWord.push({})
      this.listHorizontal.push({})
      this.listVertical.push({})
    }
  }

  createListCell() {
    this.numberCells = [];
    for(let i = 0; i < 100; i++){
      this.numberCells[i] = '';
    }
  }

  getArrayWord = (): string => {
    let words: string = '';
    this.listCellFilled.forEach((value) => {
      words += this.numberCells[value];
    });
    return words.toLowerCase();
  }

  insertAsnwer(word: Crucigram){
    if(word.position == 'Horizontal'){
      this.listHorizontalAnswer.push(word);
    }else if(word.position == 'Vertical'){
      this.listVerticalAnswer.push(word);
    }
  }

  removeAsnwer(word: Crucigram){
    if(word.position == 'Horizontal'){
      this.listHorizontalAnswer = this.listHorizontalAnswer.filter((value) => value != word);
    }else if(word.position == 'Vertical'){
      this.listVerticalAnswer = this.listVerticalAnswer.filter((value) => value != word);
    }
  }

  getInputWord(word: Crucigram): string{
    const words = this.getArrayWord();
    if(word.question && words.includes(word.question.toLowerCase())){
      return 'input filled-word';
    }
    return 'input';
  }

  getInput(indexLetter: number): string{
    if(this.listCellFilled.includes(indexLetter)){
      return 'input filled';
    }
    return 'input';
  }

  selectCell(index: number){
    this.listCellFilled.push(index);
  }

  sendData(){
    this.saveSoup();
  }

  saveSoup(){
    if(this.verifyFields()){
      this.dataActivity.horizontals = this.saveHorizontals();
      this.dataActivity.verticals = this.saveVerticals();
      if(this.verifyAnswers()){
        this.dataActivity.id = this.dataSended.id;
        this.dataActivity.name = this.dataSended.name;
        this.dataActivity.type = this.dataSended.type;
        this.saveSubscription = this.activityService.saveActivityResponse(this.dataActivity).subscribe({
          next: (res: IsAuth) => {
            if(res){
              this.setMessage('Actividad registrada');
              this.chargeListActivities();
            }else{
              this.setMessage('La actividad no pudo ser registrada');
            }
          },
          error: (err: any) => {
            this.setMessage('La actividad no pudo ser registrada');
          }
        });
      }else{
        this.setMessage('Debe completar las lista de 10 palabras.');
      }
    }else{
      this.setMessage('Debe rellenar todos los campos.');
    }
  }

  insertWord(word: Crucigram){
    const words = this.getArrayWord();
    if(word.question && words.includes(word.question.toLowerCase())){
      if(word.position == 'Horizontal'){
        this.listHorizontalAnswer.push(word);
      }else if(word.position == 'Vertical'){
        this.listVerticalAnswer.push(word);
      }
    }
  }

  saveHorizontals(): Crucigram[]{
    this.listHorizontalAnswer = [];
    for(let i = 0; i < this.listHorizontal.length; i++){
      this.insertWord(this.listHorizontal[i]);
    }
    return this.listHorizontalAnswer;
  }

  saveVerticals(): Crucigram[]{
    this.listVerticalAnswer = [];
    for(let i = 0; i < this.listVertical.length; i++){
      this.insertWord(this.listVertical[i]);
    }
    return this.listVerticalAnswer;
  }

  chargeData(){ 
    this.formatDate(this.dataSended);
    this.chargeSoup(this.dataSended);
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

  chargeSoup(dataSended: Activity){
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

  chargeTable(){
    this.listHorizontal.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined && value.position != undefined){
        for(let i = 0; i < value.answer.length; i++){
          this.numberCells[(10*value.index)+i] = value.answer[i];
        }
      }
    });
    this.listVertical.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined && value.position != undefined){
        for(let i = 0; i < value.answer.length; i++){
          this.numberCells[(10*i)+value.index] = value.answer[i];
        }
      }
    });
  }

  chargeListActivities = () => {
    this.activityService.emitLoadActivityList();
  }

  verifyFields = ():boolean => {
    if((this.dataSended.name == '') || 
        (this.dataSended.type == '')){
      return false;
    }
    return true;
  }

  verifyAnswers = ():boolean => {
    const isVer = this.listVerticalAnswer.length;
    const isHor = this.listHorizontalAnswer.length;
    if(isVer + isHor == 10){
      return true;
    }
    return false;
  }

  clearTable = () => {
    this.listCellFilled = [];
    this.listHorizontalAnswer = [];
    this.listVerticalAnswer = [];
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.cucigramSubscription?.unsubscribe();
  }

}

