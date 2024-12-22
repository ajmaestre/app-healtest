import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Activity } from '../../../interfaces/activity';
import { Crucigram } from '../../../interfaces/crucigram';
import { ActivityPanelPatientService } from '../activity-panel-patient.service';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-crucigram-panel-patient',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './crucigram-panel-patient.component.html',
  styleUrl: './crucigram-panel-patient.component.css'
})
export class CrucigramPanelPatientComponent implements OnInit, OnDestroy{

  dataCells: string = '';
  dataFormCells: string = 'div-form-cell hide';

  divWarning: string = 'div-warning hide';
  message:string = '';

  dataQuest: FormGroup;
  saveSubscription!: Subscription;
  cucigramSubscription!: Subscription;

  @Input() dataSended: Activity = {};
  dataActivity: Activity = {};
  dataCrucigram: Crucigram = {};
  listVertical: Crucigram[] = [];
  listHorizontal: Crucigram[] = [];
  numberCells: string[] = [];
  listCellFilled: number[] = []


  constructor(private activityService: ActivityPanelPatientService){
    this.dataQuest = new FormGroup({
      question: new FormControl({value: '', disabled: true}, Validators.required),
      cells: new FormArray(this.createCell()),
    });
  }

  ngOnInit(): void {
    this.createListCell();
    this.createList();
    if(this.dataSended.id)
      this.chargeData();
  }

  get cells(): FormArray {
    return this.dataQuest.get('cells') as FormArray;
  }

  createCell(): FormControl[] {
    const controls: FormControl[] = [];
    for(let i = 0; i < 10; i++){
      controls.push(new FormControl(''))
    }
    return controls;
  }

  createList() {
    this.listHorizontal = [];
    this.listVertical = [];
    for(let i = 0; i < 10; i++){
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

  getInput(indexLetter: number, cell: string): string{
    if(this.listCellFilled.includes(indexLetter) && cell != '*'){
      return 'input filled-bad';
    }else if(cell == '*'){
      return 'input filled';
    }
    return 'input';
  }

  getInputControl(index: number): string{
    if(this.cells.at(index).value === '*'){
      this.cells.at(index).disable();
      return 'input filled';
    }
    return 'input';
  }

  openModalAddQuest(data: Crucigram, index: number, position: string){
    this.dataFormCells = 'div-form-cell show'
    this.dataCells = 'data-cells';
    this.setCellsInBlack(data, index, position);
  }

  setCellsInBlack(data: Crucigram, index: number, position: string){
    this.dataCrucigram = data;
    this.dataCrucigram.index = index;
    this.dataCrucigram.position = position;
    if(this.dataCrucigram.position == 'Horizontal'){
      if(this.dataCrucigram.index != undefined){
        this.dataQuest.get('question')?.setValue(this.listHorizontal[index].question);
        for(let i = 0; i < 10; i++){
          this.cells.at(i).setValue(this.numberCells[(10*this.dataCrucigram.index)+i]);
        }
      }
    }else if(this.dataCrucigram.position == 'Vertical'){
      if(this.dataCrucigram.index != undefined){
        this.dataQuest.get('question')?.setValue(this.listVertical[index].question);
        for(let i = 0; i < this.cells.length; i++){
          this.cells.at(i).setValue(this.numberCells[(10*i)+this.dataCrucigram.index]);
        }
      }
    }
  }

  closeModalCell(){
    this.dataCells = 'data-cells page-out';
    setTimeout(() => {
      this.dataFormCells = 'div-form-cell hide';
    }, 500);
    this.clearCells();
  }

  getWordFilled(word: string, cells: FormArray, indexLetter: number, position: string){
    word = word.toLowerCase();
    word.split('').forEach((value, index) => {
      let letter: string = cells.at(index).value;
      letter = letter.toLowerCase();
      if(value != letter){
        if(position == 'Horizontal'){
          this.listCellFilled.push((10*indexLetter)+index)
        }else if(position == 'Vertical'){
          this.listCellFilled.push((10*index)+indexLetter);
        }
      }else{
        if(position == 'Horizontal'){
          this.listCellFilled = this.listCellFilled.filter((value) => value != ((10*indexLetter)+index));
        }else if(position == 'Vertical'){
          this.listCellFilled = this.listCellFilled.filter((value) => value != ((10*index)+indexLetter));
        }
      }
    });
  }

  registrar(){
    if(this.verifyCells() && this.verifyQuestion() && this.dataCrucigram.answer != undefined && this.dataCrucigram.index != undefined && this.dataCrucigram.position != undefined){
      for(let i = 0; i < this.cells.length; i++){
        this.cells.at(i).setValue(this.cells.at(i).value);
        if(this.dataCrucigram.position == 'Horizontal'){
          this.numberCells[(10*this.dataCrucigram.index)+i] = this.cells.at(i).value;
        }else if(this.dataCrucigram.position == 'Vertical'){
          this.numberCells[(10*i)+this.dataCrucigram.index] = this.cells.at(i).value;
        }
      }
      this.getWordFilled(this.dataCrucigram.answer, this.cells, this.dataCrucigram.index,  this.dataCrucigram.position);
      this.setMessage('Palabra registrada');
    }else{
      this.setMessage('Debe completar al menos una celda de la respuesta');
    }
  }

  verifyCells = (): boolean => {
    let count: number = 0;
    for(let i = 0; i < this.cells.length; i++){
      if(this.cells.at(i).value == '')
        count++;
    }
    if(count == this.cells.length)
      return false;
    return true;
  }

  verifyQuestion = (): boolean => {
    if(this.dataQuest.value.question == '')
      return false;
    return true;
  }

  clearCells(){
    this.dataQuest.get('question')?.setValue('');
    for(let i = 0; i < this.cells.length; i++){
      this.cells.at(i).setValue('');
    }
  }

  reloadCells(){
    for(let i = 0; i < this.cells.length; i++){
      if(this.cells.at(i).value != '*'){
        this.cells.at(i).setValue('');
        this.cells.at(i).enable();
      }
    }
  }

  sendData(){
    this.saveCrucigrama();
  }

  saveCrucigrama(){
    if(this.verifyFields()){
      if(this.verifyQuestions() && this.verifyTabla()){
        this.dataActivity.id = this.dataSended.id;
        this.dataActivity.name = this.dataSended.name;
        this.dataActivity.type = this.dataSended.type;
        this.dataActivity.horizontals = this.saveHorizontals();
        this.dataActivity.verticals = this.saveVerticals();
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
        this.setMessage('Debe completar todo el crucigrama.');
      }
    }else{
      this.setMessage('Debe rellenar todos los campos.');
    }
  }

  saveHorizontals(): Crucigram[]{
    this.dataCrucigram = {};
    let answer: string = '';
    for(let i = 0; i < this.listHorizontal.length; i++){
      for(let j = 0; j < this.cells.length; j++){
        answer += this.numberCells[(10*i)+j];
      }
      this.listHorizontal[i].index = i
      this.listHorizontal[i].answer = answer;
      this.listHorizontal[i].position = 'Horizontal';
      answer = '';
    }
    return this.listHorizontal;
  }

  saveVerticals(): Crucigram[]{
    this.dataCrucigram = {};
    let answer: string = '';
    for(let i = 0; i < this.listVertical.length; i++){
      for(let j = 0; j < this.cells.length; j++){
        answer += this.numberCells[(10*j)+i];
      }
      this.listVertical[i].index = i
      this.listVertical[i].answer = answer;
      this.listVertical[i].position = 'Vertical';
      answer = '';
    }
    return this.listVertical;
  }

  chargeData(){ 
    this.formatDate(this.dataSended);
    this.chargeCrucigram(this.dataSended);
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
      if(value.index != undefined && value.answer != undefined){
        for(let i = 0; i < value.answer.length; i++){
          if(value.answer[i] == '*')
            this.numberCells[(10*value.index)+i] = value.answer[i];
        }
      }
    });
    this.listVertical.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined){
        for(let i = 0; i < value.answer.length; i++){
          if(value.answer[i] == '*')
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

  verifyTabla = ():boolean => {
    for (let index = 0; index < this.numberCells.length; index++) {
      if(this.numberCells[index] == ''){
        return false;
      }
    }
    return true;
  }

  verifyQuestions = ():boolean => {
    const isVer = this.listVertical.find((value, index) => !value.question || value.question?.length == 0);
    const isHor = this.listHorizontal.find((value, index) => !value.question || value.question?.length == 0);
    if(isVer || isHor){
      return false;
    }
    return true;
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  clearTable(){
    for(let i = 0; i < 100; i++){
      if(this.numberCells[i] != '*'){
        this.numberCells[i] = '';
      }
    }
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.cucigramSubscription?.unsubscribe();
  }

}

