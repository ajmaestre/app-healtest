import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Group } from '../../../interfaces/group';
import { User } from '../../../interfaces/user';
import { IsAuth } from '../../../interfaces/isAuth';
import { GroupPanelService } from '../group-panel.service';

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.css'
})
export class AddGroupComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveGroupSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  dataGroup: Group = {};
  doctorList: User[] = [];

  constructor(private groupService: GroupPanelService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      user_id: new FormControl('monitor', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.dataGroupSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.edit){
        this.chargeData(dataSended.group);
        this.data.get('user_id')?.disable();
      }else if(!dataSended.edit){
        this.data.get('user_id')?.enable();
        this.data.get('user_id')?.setValue('monitor');
      }
    });
    this.getDoctors();
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      group: {},
      edit: false
    }
    this.groupService.emitDataGroup(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.groupService.emitDataGroup(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    if(this.data.value?.id){
      this.updateGroup();
    }else{
      this.saveGroup();
    }
  }

  saveGroup(){
    if(this.verifyFields()){
      this.dataGroup = this.data.value;
      this.saveGroupSubscription = this.groupService.saveGroup(this.dataGroup).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Grupo registrado');
            this.clearForm(); 
            this.chargeListGroups();
          }else{
            this.setMessage('Ya existe un grupo registrado con el mismo nombre');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('El grupo no puedo ser registrado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  updateGroup(){
    if(this.verifyFields()){
      this.saveGroupSubscription = this.groupService.updateGroup(this.data.value.id, this.data.value).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Grupo actualizado');
          }
          this.chargeListGroups();
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('El grupo no puedo ser actualizado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }
  
  getDoctors = () => {
    this.doctorsSubscription = this.groupService.getMonitorList().subscribe({
      next: (res: User[]) =>{
        this.doctorList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  chargeData(dataSended: Group){ 
    this.data.setValue({
      id: dataSended?.id,
      name: dataSended?.name,
      description: dataSended?.description,
      user_id: dataSended?.user_id,
    });
  }

  chargeListGroups = () => {
    this.groupService.emitLoadGroupList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.description == '') ||
        (this.data.value.user_id == '') || 
        (this.data.value.user_id == 'monitor')){
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
      user_id: 'monitor',
    });
  }

  ngOnDestroy(): void {
    this.saveGroupSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
  }

}
