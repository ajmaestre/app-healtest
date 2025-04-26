import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Activity } from '../../../interfaces/activity';
import { Crucigram } from '../../../interfaces/crucigram';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-add-soup-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './add-soup-doctor.component.html',
  styleUrl: './add-soup-doctor.component.css'
})
export class AddSoupDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';
  dataCells: string = '';
  dataFormCells: string = 'div-form-cell hide';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  dataQuest: FormGroup;
  saveSubscription!: Subscription;
  cucigramSubscription!: Subscription;

  dataActivity: Activity = {};
  dataCrucigram: Crucigram = {};
  listWord: Crucigram[] = [];
  listVertical: Crucigram[] = [];
  listHorizontal: Crucigram[] = [];
  numberCells: string[] = [];
  letterList: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'J', 'L', 
    'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y'
  ];
  listCellFilled: number[] = []


  constructor(private activityService: ActivityPanelDoctorService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });
    this.dataQuest = new FormGroup({
      question: new FormControl('', Validators.required),
      cells: new FormArray(this.createCell()),
    });
  }

  ngOnInit(): void {
    this.createListCell();
    this.createList();
    this.activityService.dataSoupSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.soup);
        this.chargeSoup(dataSended.soup);
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
  }

  generateLetter(): string{
    const indexRandom = Math.floor(Math.random() * 20);
    return this.letterList[indexRandom];
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

  getInput(indexLetter: number): string{
    if(this.listCellFilled.includes(indexLetter)){
      return 'input filled';
    }
    return 'input';
  }

  getInputControl(index: number): string{
    return 'input';
  }

  openModalAddQuest(data: Crucigram, index: number, position: string){
    if(!this.verifyQuestions()){
      this.setMessage('Ya ha completado las 10 palabras.');
    }else{
      this.dataFormCells = 'div-form-cell show'
      this.dataCells = 'data-cells';
      this.setCellsInBlack(data, index, position);
    }
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

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      soup: {},
      edit: false
    }
    this.activityService.emitDataSoup(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataSoup(data);
      this.clearForm();
    }, 500);
  }

  closeModalCell(){
    this.dataCells = 'data-cells page-out';
    setTimeout(() => {
      this.dataFormCells = 'div-form-cell hide';
    }, 500);
    this.clearCells();
  }

  getWordFilled(word: string, cells: FormArray, indexLetter: number, position: string){
    const indexArray: number[] = [];
    word = word.toLowerCase();
    word.split('').forEach((value, ind) => {
      for(let i = 0; i < cells.length; i++){
        let letter: string = cells.at(i).value;
        letter = letter.toLowerCase();
        if(value == letter && indexArray.length == 0 && cells.at(i+1)?.value == word[ind+1]){
          indexArray.push(i);
          break;
        }else if(value == letter && indexArray[indexArray.length-1] + 1 == i){
          indexArray.push(i);
          break;
        }
      }
    });
    if(word.split('').length == indexArray.length){
      if(position == 'Horizontal'){
        indexArray.forEach((value, index, array) => this.listCellFilled.push((10*indexLetter)+value));
      }else if(position == 'Vertical'){
        indexArray.forEach((value, index, array) => this.listCellFilled.push((10*value)+indexLetter));
      }
    }
  }

  registrar(){
    if(this.verifyCells() && this.verifyQuestion() && this.dataCrucigram.index != undefined && this.dataCrucigram.position != undefined){
      if(this.dataCrucigram.position == 'Horizontal'){
        for(let i = 0; i < this.cells.length; i++){
          const letter: string = this.generateLetter();
          const indexNew = (10*this.dataCrucigram.index)+i;
          this.cells.at(i).setValue(this.cells.at(i).value? this.cells.at(i).value : letter);
          this.numberCells[indexNew] = this.cells.at(i).value;
        }
      }else if(this.dataCrucigram.position == 'Vertical'){
        for(let i = 0; i < this.cells.length; i++){
          const letter: string = this.generateLetter();
          const indexNew = (10*i)+this.dataCrucigram.index;
          this.cells.at(i).setValue(this.cells.at(i).value? this.cells.at(i).value : letter);
          this.numberCells[indexNew] = this.cells.at(i).value;
        }
      }
      this.getWordFilled(this.dataQuest.get('question')?.value, this.cells, this.dataCrucigram.index,  this.dataCrucigram.position);
      this.dataCrucigram.question = this.dataQuest.get('question')?.value;
      if(!this.listWord.includes(this.dataCrucigram)){
        this.listWord.pop();
        this.listWord.unshift(this.dataCrucigram);
      }
    }else{
      this.setMessage('Debe completar al menos una celda de la respuesta e ingresar una pregunta.');
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

  reloadQuestion(){
    this.dataQuest.get('question')?.setValue('');
  }

  reloadCells(){
    for(let i = 0; i < this.cells.length; i++){
      this.cells.at(i).setValue('');
    }
  }

  sendData(){
    if(this.data.value?.id){
      this.updateSoup();
    }else{
      this.saveSoup();
    }
  }

  fillTable(){
    this.numberCells = this.numberCells.map((value, index) => value == ''? this.generateLetter() : value);
  }

  saveSoup(){
    this.data.get('type')?.setValue('soup');
    if(this.verifyFields()){
      if(!this.verifyQuestions()){
        this.fillTable();
        this.dataActivity.id = this.data.get('id')?.value;
        this.dataActivity.name = this.data.get('name')?.value;
        this.dataActivity.type = this.data.get('type')?.value;
        this.dataActivity.horizontals = this.saveHorizontals();
        this.dataActivity.verticals = this.saveVerticals();
        this.saveSubscription = this.activityService.saveActivity(this.dataActivity).subscribe({
          next: (res: IsAuth) => {
            if(res){
              this.setMessage('Actividad registrada');
              this.clearForm();
              this.clearTable();
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

  updateSoup(){
    if(this.verifyFields()){
      if(!this.verifyQuestions()){
        this.dataActivity.id = this.data.get('id')?.value;
        this.dataActivity.name = this.data.get('name')?.value;
        this.dataActivity.type = this.data.get('type')?.value;
        this.dataActivity.horizontals = this.saveHorizontals();
        this.dataActivity.verticals = this.saveVerticals();
        this.saveSubscription = this.activityService.updateActivity(this.data.value.id, this.dataActivity).subscribe({
          next: (res: IsAuth) => {
            if(res){
              this.setMessage('Actividad actualizada');
              this.chargeListActivities();
            }else{
              this.setMessage('La actividad no pudo ser actualizada');
            }
          },
          error: (err: any) => {
            this.setMessage('La actividad no pudo ser actualizada');
          }
        });
      }else{
        this.setMessage('Debe completar las lista de 10 palabras.');
      }
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  saveHorizontals(): Crucigram[]{
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

  chargeData(dataSended: Activity){ 
    this.data.setValue({
      id: dataSended?.id,
      name: dataSended?.name,
      type: dataSended?.type,
    });
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
        if(value.question != undefined)
          this.getTableFilled(value.question, value.answer, value.index, value.position);
      }
    });
    this.listVertical.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined && value.position != undefined){
        for(let i = 0; i < value.answer.length; i++){
          this.numberCells[(10*i)+value.index] = value.answer[i];
        }
        if(value.question != undefined)
          this.getTableFilled(value.question, value.answer, value.index, value.position);
      }
    });
  }

  getTableFilled(word: string, answer: string, indexLetter: number, position: string){
    const indexArray: number[] = [];
    word = word.toLowerCase();
    word.split('').forEach((value, ind) => {
      answer.split('').forEach((char, index) => {
        char = char.toLowerCase();
        if(value == char && indexArray.length == 0  && answer[index+1] == word[ind+1]){
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

  chargeListActivities = () => {
    this.activityService.emitLoadActivityList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.type == '')){
      return false;
    }
    return true;
  }

  verifyQuestions = ():boolean => {
    const isVer = this.listVertical.filter((value, index) => value.question?.length);
    const isHor = this.listHorizontal.filter((value, index) => value.question?.length);
    if(isVer.length + isHor.length < 10){
      return true;
    }
    return false;
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  clearForm(){
    this.data.setValue({
      id: '',
      name: '',
      type: '',
    });
  }

  clearTable(){
    this.clearForm();
    this.createList();
    this.createListCell();
    this.listCellFilled = [];
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.cucigramSubscription?.unsubscribe();
  }

}

