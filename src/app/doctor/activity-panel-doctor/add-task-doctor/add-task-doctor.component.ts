import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from '../../../interfaces/task';
import { ActivityPanelDoctorService } from '../activity-panel-doctor.service';
import { IsAuth } from '../../../interfaces/isAuth';
import { Activity } from '../../../interfaces/activity';
import { TaskActivity } from '../../../interfaces/taskActivity';

@Component({
  selector: 'app-add-task-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './add-task-doctor.component.html',
  styleUrl: './add-task-doctor.component.css'
})
export class AddTaskDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveTaskSubscription!: Subscription;
  taskSubscription!: Subscription;
  dataTask: Task = {};
  dataActivity: TaskActivity = {};

  constructor(private activityService: ActivityPanelDoctorService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.activityService.dataTaskSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeTask(dataSended.task);
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
      task: {},
      edit: false
    }
    this.activityService.emitDataTask(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.activityService.emitDataTask(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    if(this.data.value?.id){
      this.updateTask();
    }else{
      this.saveTask();
    }
  }

  saveTask(){
    if(this.verifyFields()){
      this.dataTask = this.data.value;
      this.dataActivity.name = this.dataTask.name;
      this.dataActivity.type = 'task';
      this.dataActivity.task = this.dataTask;
      this.saveTaskSubscription = this.activityService.saveTask(this.dataActivity).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Tarea registrada');
            this.clearForm(); 
            this.chargeListTasks();
          }else{
            this.setMessage('Ya existe una tarea registrada con el mismo nombre');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('La tarea no puedo ser registrada');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  updateTask(){
    if(this.verifyFields()){
      this.saveTaskSubscription = this.activityService.updateTask(this.data.value.id, this.data.value).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Tarea actualizada');
          }
          this.chargeListTasks();
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('La tarea no pudo ser actualizada');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  chargeTask(dataSended: Activity){
      if(dataSended.id){
        this.taskSubscription = this.activityService.getTasks(dataSended.id).subscribe({
          next: (res: Task) => {
            const listRes = res;
            console.log(listRes)
            this.data.setValue({
              id: dataSended.id,
              name: listRes?.name,
              description: listRes?.description,
            });
          },
          error: (err: any) => {
            console.log(err)
          }
        });
      }
    }

  chargeListTasks = () => {
    this.activityService.emitLoadActivityList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.description == '') || 
        (this.data.value.user_id == '')){
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
      description: '',
    });
  }

  ngOnDestroy(): void {
    this.saveTaskSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
  }

}
