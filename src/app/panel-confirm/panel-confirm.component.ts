import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IsAuth } from '../interfaces/isAuth';
import { PanelConfirmService } from './panel-confirm.service';

@Component({
  selector: 'app-panel-confirm',
  standalone: true,
  imports: [],
  templateUrl: './panel-confirm.component.html',
  styleUrl: './panel-confirm.component.css'
})
export class PanelConfirmComponent implements OnInit, OnDestroy{

  @Input() page: string = '';
  @Input() pageAdd: string = '';
  @Input() elementId!: number;
  @Input() typeElement: string = '';
  @Output() closePage = new EventEmitter<{page: string, pageAdd: string, elementId: number, typeElement: string}>();

  divWarning: string = 'div-warning hide';
  message:string = '';

  deleteSubscription!: Subscription;

  constructor(private confirmService: PanelConfirmService){}

  ngOnInit(): void {}

  closeModal = () => {
    this.closePage.emit({page: "div-form-add show", pageAdd: "page-add page-out", elementId: 0, typeElement: ''});
    setTimeout(() => {
      this.closePage.emit({page: "div-form-add hide", pageAdd: "page-add page-out", elementId: 0, typeElement: ''});
    }, 500);
  }

  delete(){
    if(this.typeElement == 'patient' || this.typeElement == 'doctor'){
      this.deleteUser();
    }else if(this.typeElement == 'group'){
      this.deleteGroup();
    }else if(this.typeElement == 'resourse'){
      this.deleteResourse();
    }else if(this.typeElement == 'question'){
      this.deleteQuestion();
    }else if(this.typeElement == 'test'){
      this.deleteTest();
    }else if(this.typeElement == 'activity'){
      this.deleteActivity();
    }
  }
  
  deleteUser = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteUser(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            if(this.typeElement == 'patient'){
              this.setMessage("Paciente eliminado");
              this.chargeListPatients();
            }else if(this.typeElement == 'doctor'){
              this.setMessage("Monitor eliminado");
              this.chargeListDoctors();
            }
          }else{
            this.setMessage("No se pudo eliminar el elemento");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }

  deleteGroup = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteGroup(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage("Grupo eliminado");
            this.chargeListGroups();
          }else{
            this.setMessage("No se pudo eliminar el grupo");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }

  deleteResourse = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteResourse(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage("Recurso eliminado");
            this.chargeListResourses();
          }else{
            this.setMessage("No se pudo eliminar el recurso");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }

  deleteQuestion = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteQuestion(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage("Pregunta eliminada");
            this.chargeListQuestions();
          }else{
            this.setMessage("No se pudo eliminar la pregunta");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }

  deleteTest = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteTest(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage("Evaluación eliminada");
            this.chargeListTests();
          }else{
            this.setMessage("No se pudo eliminar la evaluación");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }

  deleteActivity = () => {
    if(this.elementId){
      this.deleteSubscription = this.confirmService.deleteActivity(this.elementId).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage("Actividad eliminada");
            this.chargeListActs();
          }else{
            this.setMessage("No se pudo eliminar la actividad");
          }
        },
        error: (err: any) => {
          this.setMessage("No se pudo eliminar el elemento");
        }
      });
    }
  }
  
  chargeListPatients = () => {
    this.confirmService.emitLoadPatientList();
  }

  chargeListDoctors = () => {
    this.confirmService.emitLoadDoctorList();
  }

  chargeListGroups = () => {
    this.confirmService.emitLoadGroupList();
  }

  chargeListResourses = () => {
    this.confirmService.emitLoadResourseList();
  }

  chargeListQuestions = () => {
    this.confirmService.emitLoadQuestionList();
  }

  chargeListTests = () => {
    this.confirmService.emitLoadTestList();
  }

  chargeListActs = () => {
    this.confirmService.emitLoadActivityList();
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 1500);
  }

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

}
