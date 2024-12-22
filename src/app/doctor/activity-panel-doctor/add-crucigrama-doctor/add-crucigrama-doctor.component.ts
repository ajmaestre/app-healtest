import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Activity } from '../../../interfaces/activity';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';
import { Crucigram } from '../../../interfaces/crucigram';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-add-crucigrama-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './add-crucigrama-doctor.component.html',
  styleUrl: './add-crucigrama-doctor.component.css'
})
export class AddCrucigramaDoctorComponent implements OnInit, OnDestroy{

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
  listVertical: Crucigram[] = [];
  listHorizontal: Crucigram[] = [];
  numberCells: string[] = [];


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
    this.activityService.dataCrucigramaSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.crucigrama);
        this.chargeCrucigram(dataSended.crucigrama);
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
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

  getInput(cell: string): string{
    if(cell == '*'){
      return 'input filled';
    }
    return 'input';
  }

  getInputControl(index: number): string{
    if(this.cells.at(index).value === '*'){
      this.cells.at(index).disable();
      return 'input filled';
    }else if(this.cells.at(index).value.length != 0){
      this.cells.at(index).disable();
      return 'input';
    }
    this.cells.at(index).enable();
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

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      crucigrama: {},
      edit: false
    }
    this.activityService.emitDataCrucigrama(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataCrucigrama(data);
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

  registrar(){
    if(this.verifyCells() && this.verifyQuestion()){
      if(this.dataCrucigram.position == 'Horizontal'){
        if(this.dataCrucigram.index != undefined){
          for(let i = 0; i < this.cells.length; i++){
            this.cells.at(i).setValue(this.cells.at(i).value? this.cells.at(i).value : '*');
            this.numberCells[(10*this.dataCrucigram.index)+i] = this.cells.at(i).value? this.cells.at(i).value : '*';
          }
        }
      }else if(this.dataCrucigram.position == 'Vertical'){
        if(this.dataCrucigram.index != undefined){
          for(let i = 0; i < this.cells.length; i++){
            this.cells.at(i).setValue(this.cells.at(i).value? this.cells.at(i).value : '*');
            this.numberCells[(10*i)+this.dataCrucigram.index] = this.cells.at(i).value? this.cells.at(i).value : '*';
          }
        }
      }
      this.dataCrucigram.question = this.dataQuest.get('question')?.value;
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
      this.cells.at(i).enable();
    }
  }

  sendData(){
    if(this.data.value?.id){
      this.updateCrucigrama();
    }else{
      this.saveCrucigrama();
    }
  }

  saveCrucigrama(){
    this.data.get('type')?.setValue('crucigrama');
    if(this.verifyFields()){
      if(this.verifyQuestions() && this.verifyTabla()){
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
        this.setMessage('Debe completar todo el crucigrama y las preguntas.');
      }
    }else{
      this.setMessage('Debe rellenar todos los campos.');
    }
  }

  updateCrucigrama(){
    if(this.verifyFields()){
      if(this.verifyTabla() && this.verifyQuestions()){
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
        this.setMessage('Debe completar todo el crucigrama y las preguntas.');
      }
    }else{
      this.setMessage('Debe rellenar todos los campos');
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

  chargeData(dataSended: Activity){ 
    this.data.setValue({
      id: dataSended?.id,
      name: dataSended?.name,
      type: dataSended?.type,
    });
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
          this.numberCells[(10*value.index)+i] = value.answer[i];
        }
      }
    });
    this.listVertical.forEach((value, index) => {
      if(value.index != undefined && value.answer != undefined){
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
    if((this.data.value.name == '') || 
        (this.data.value.type == '')){
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
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.cucigramSubscription?.unsubscribe();
  }

}

