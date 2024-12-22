import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Resourse } from '../../../interfaces/resourse';
import { IsAuth } from '../../../interfaces/isAuth';
import { ResoursePanelDoctorService } from '../resourse-panel-doctor.service';

@Component({
  selector: 'app-add-resourse-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './add-resourse-doctor.component.html',
  styleUrl: './add-resourse-doctor.component.css'
})
export class AddResourseDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveResourseSubscription!: Subscription;
  fileSubscription!: Subscription;
  dataResourse: Resourse = {};
  selectedFile?: File;
  typeFile?: string;
  realTypeFile?: string;


  constructor(private resourseService: ResoursePanelDoctorService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      type: new FormControl({value: '', disabled: true}, Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.resourseService.dataResourseSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.resourse);
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      resourse: {},
      edit: false
    }
    this.resourseService.emitDataResourse(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.resourseService.emitDataResourse(data);
      this.clearForm();
    }, 500);
  }

  onLoad(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
    if(this.selectedFile?.name){
      const nameFile = this.selectedFile?.name.split(".");
      this.data.get('type')?.setValue(nameFile[nameFile.length-1]);
      this.typeFile = nameFile[nameFile.length-1];
      this.realTypeFile = this.selectedFile.type;
    }
  }

  download(){
    if(this.data.value.id){
      this.fileSubscription = this.resourseService.getResourse(this.data.value.id).subscribe({
        next: (res: Blob) =>{
          const url = URL.createObjectURL(res);
          window.open(url, '_blank');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }else if(this.selectedFile?.name){
      const url = URL.createObjectURL(this.selectedFile);
      window.open(url, '_blank');
    }else{
      this.setMessage('El recurso no ha sido seleccionado');
    }
  }

  sendData(){
    if(this.data.value?.id){
      this.updateResourse();
    }else{
      this.saveResourse();
    }
  }

  saveResourse(){
    if(this.selectedFile){
      if(this.verifyFields()){
        this.dataResourse = this.data.value;
        this.dataResourse.file = this.selectedFile;
        this.dataResourse.type = this.typeFile;
        this.dataResourse.realtype = this.realTypeFile;
        this.saveResourseSubscription = this.resourseService.saveResourse(this.dataResourse).subscribe({
          next: (res: IsAuth) =>{
            if(res.response){
              this.setMessage('Recurso registrado');
              this.clearForm(); 
              this.chargeListResourses();
            }else{
              this.setMessage('El recurso no pudo ser registrado');
            }
          },
          error: (err: any) => {
            console.log(err);
            this.setMessage('El recurso no pudo ser registrado');
          }
        }); 
      }else{
        this.setMessage('Debe rellenar todos los campos');
      }
    }else{
      this.setMessage('Debe escoger un archivo');
    } 
  }

  updateResourse(){
    if(this.verifyFields()){
      this.dataResourse = this.data.value;
      this.dataResourse.file = this.selectedFile;
      this.dataResourse.type = this.typeFile;
      this.dataResourse.realtype = this.realTypeFile;
      this.saveResourseSubscription = this.resourseService.updateResourse(this.data.value.id, this.data.value).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Recurso actualizado');
          }
          this.chargeListResourses();
        },
        error: (err: any) => {
          this.setMessage('El recurso no pudo ser actualizado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }
  
  chargeData(dataSended: Resourse){ 
    this.data.setValue({
      id: dataSended?.id,
      name: dataSended?.name,
      type: dataSended?.type,
      description: dataSended?.description,
    });
    this.typeFile = dataSended?.type;
    this.realTypeFile = dataSended?.realtype;
  }

  chargeListResourses = () => {
    this.resourseService.emitLoadResourseList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.type == '') || 
        (this.data.value.description == '')){
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
      description: '',
    });
    this.dataResourse.type = '';
  }

  ngOnDestroy(): void {
    this.saveResourseSubscription?.unsubscribe();
    this.fileSubscription?.unsubscribe();
  }

}
