import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { IsAuth } from '../../../interfaces/isAuth';
import { PasswordPanelService } from '../../../password-panel/password-panel.service';
import { Group } from '../../../interfaces/group';
import { PatientPanelDoctorService } from '../patient-panel-doctor.service';

@Component({
  selector: 'app-add-patient-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './add-patient-doctor.component.html',
  styleUrl: './add-patient-doctor.component.css'
})
export class AddPatientDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveUserSubscription!: Subscription;
  groupsSubscription!: Subscription;
  groupSubscription!: Subscription;
  dataUser: User = {};
  groupList: Group[] = [];
  isPassFine: boolean = false;

  constructor(private patientService: PatientPanelDoctorService, private passwordService: PasswordPanelService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      group_id: new FormControl('grupo', Validators.required),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.patientService.dataPatientSent$.subscribe((dataSended) => {
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
    this.getGroups();
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      user: {},
      edit: false
    }
    this.patientService.emitDataPatient(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.patientService.emitDataPatient(data);
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

  getGroups = () => {
    this.groupsSubscription = this.patientService.getGroupsByMonitor().subscribe({
      next: (res: Group[]) =>{
        this.groupList = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  saveUser(){
    this.dataUser = {};
    if(this.verifyFields() && this.isPassFine){
      this.dataUser = this.data.value;
      this.saveUserSubscription = this.patientService.savePatient(this.dataUser).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Paciente registrado');
            this.clearForm(); 
            this.chargeListPatients();
          }else{
            this.setMessage('Ya existe un usuario registrado con el mismo nombre de usuario o correo electronico');
          }
        },
        error: (err: any) => {
          this.setMessage('El paciente no puedo ser registrado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos y digitar correctamente las contraseñas');
    }
  }

  updateUser(){
    this.dataUser = {};
    if(this.verifyFields()){
      this.dataUser = this.data.value;
      this.saveUserSubscription = this.patientService.updateUser(this.data.value.id, this.dataUser).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Paciente actualizado');
          }
          this.chargeListPatients();
        },
        error: (err: any) => {
          this.setMessage('El paciente no puedo ser actualizado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  comparePassword = () => {
    if(this.data.value.password != this.data.value.passwordConfirm){
      this.setMessage('Las contraseñas no coinciden');
      this.isPassFine = false;
    }else{
      this.isPassFine = true;
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

  chargeData = (dataSended: User) => {
    if(dataSended.id){
      this.groupSubscription = this.patientService.getGroupByPatient(dataSended.id).subscribe({
        next: (res: Group) =>{
          if(res){
            this.data.setValue({
              id: dataSended?.id,
              name: dataSended?.name,
              lastname: dataSended?.lastname,
              email: dataSended?.email,
              group_id: res.id,
              username: dataSended?.username,
              telephone: dataSended?.telephone,
              password: 'password',
              passwordConfirm: 'password',
            });
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeListPatients = () => {
    this.patientService.emitLoadPatientList();
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.lastname == '') || 
        (this.data.value.email == '') || 
        (this.data.value.group_id == '') || 
        (this.data.value.group_id == 'grupo') || 
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
      group_id: 'grupo',
      username: '',
      telephone: '',
      password: '',
      passwordConfirm: '',
    });
  }

  ngOnDestroy(): void {
    this.saveUserSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
    this.groupSubscription?.unsubscribe();
  }

}
