import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { User } from '../../../interfaces/user';
import { PasswordPanelService } from '../../../password-panel/password-panel.service';
import { DoctorPanelService } from '../doctor-panel.service';
import { IsAuth } from '../../../interfaces/isAuth';

@Component({
  selector: 'app-add-monitor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './add-monitor.component.html',
  styleUrl: './add-monitor.component.css'
}) 
export class AddMonitorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveUserSubscription!: Subscription;
  dataUser: User = {};

  constructor(private doctorService: DoctorPanelService, private passwordService: PasswordPanelService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.doctorService.dataDoctorSent$.subscribe((dataSended) => {
      if(dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.chargeData(dataSended.user);
        this.data.get('password')?.disable();
        this.data.get('passwordConfirm')?.disable();
      }else if(!dataSended.edit){
        this.page = dataSended.page;
        this.pageAdd = dataSended.pageAdd;
        this.data.get('password')?.enable();
        this.data.get('passwordConfirm')?.enable();
      }
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      user: {},
      edit: false
    }
    this.doctorService.emitDataDoctor(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.doctorService.emitDataDoctor(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    if(this.data.value?.id){
      this.updateUser();
    }else{
      this.saveUser();
    }
  }

  saveUser(){
    if(this.verifyFields()){
      this.dataUser = this.data.value;
      this.saveUserSubscription = this.doctorService.saveDoctor(this.dataUser).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Monitor registrado');
            this.clearForm(); 
            this.chargeListDoctors();
          }else{
            this.setMessage('Ya existe un usuario registrado con el mismo nombre de usuario o correo electronico');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('El monitor no puedo ser registrado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  updateUser(){
    if(this.verifyFields()){
      this.saveUserSubscription = this.doctorService.updateUser(this.data.value.id, this.data.value).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Monitor actualizado');
          }
          this.chargeListDoctors();
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('El monitor no puedo ser actualizado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  changePassword = (id: number) => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      id: id,
      own: false,
    }
    this.passwordService.emitDataPassword(data);
  }

  chargeData(dataSended: User){ 
    this.data.setValue({
      id: dataSended?.id,
      name: dataSended?.name,
      lastname: dataSended?.lastname,
      email: dataSended?.email,
      username: dataSended?.username,
      telephone: dataSended?.telephone,
      password: 'password',
      passwordConfirm: 'password',
    });
  }

  chargeListDoctors = () => {
    this.doctorService.emitLoadDoctorList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.lastname == '') || 
        (this.data.value.email == '') || 
        (this.data.value.username == '') || 
        (this.data.value.telephone == '') || 
        (this.data.value.passwordConfirm == '') || 
        (this.data.value.password == '')){
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
      lastname: '',
      email: '',
      username: '',
      telephone: '',
      password: '',
      passwordConfirm: '',
    });
  }

  ngOnDestroy(): void {
    this.saveUserSubscription?.unsubscribe();
  }

}
 