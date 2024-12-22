import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../../interfaces/user';
import { IsAuth } from '../../../interfaces/isAuth';
import { Group } from '../../../interfaces/group';
import { GroupPanelDoctorService } from '../group-panel-doctor.service';

@Component({
  selector: 'app-group-patient-add-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './group-patient-add-doctor.component.html',
  styleUrl: './group-patient-add-doctor.component.css'
})
export class GroupPatientAddDoctorComponent implements OnInit, OnDestroy{

  page: string = '';
  pageAdd: string = '';

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  saveUserSubscription!: Subscription;
  groupsSubscription!: Subscription;
  groupSubscription!: Subscription;
  dataUser: User = {};
  dataGroup: Group = {};

  constructor(private groupService: GroupPanelDoctorService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      group: new FormControl({disabled: true, value: ''}, Validators.required),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.groupService.dataPatientSent$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      if(dataSended.group)
        this.chargeGroup(dataSended.group);
    });
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      group: {}
    }
    this.groupService.emitDataPatient(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.groupService.emitDataPatient(data);
      this.clearForm();
    }, 500);
  }

  sendData(){
    this.saveUser();
  }

  saveUser(){
    this.dataUser = {};
    if(this.verifyFields()){
      this.dataUser = this.data.value;
      this.dataUser.group_id = this.dataGroup.id;
      this.saveUserSubscription = this.groupService.savePatient(this.dataUser).subscribe({
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
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  chargeGroup = (dataSended: Group) => {
    this.dataGroup = dataSended;
    this.data.get('group')?.setValue(dataSended.name);
  }

  chargeListPatients = () => {
    if(this.dataGroup.id){
      const data = {
        id: this.dataGroup.id,
      };
      this.groupService.emitLoadPatientList(data);
    }
  }

  verifyFields = ():boolean => {
    if((this.data.value.name == '') || 
        (this.data.value.lastname == '') || 
        (this.data.value.email == '') || 
        (this.data.value.group == '') || 
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
      group: '',
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
