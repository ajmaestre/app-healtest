import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DoctorService } from '../doctor.service';
import { PasswordPanelService } from '../../password-panel/password-panel.service';
import { User } from '../../interfaces/user';
import { IsAuth } from '../../interfaces/isAuth';

@Component({
  selector: 'app-perfil-panel-doctor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './perfil-panel-doctor.component.html',
  styleUrl: './perfil-panel-doctor.component.css'
})
export class PerfilPanelDoctorComponent implements OnInit, OnDestroy{

  divWarning: string = '';
  message:string = '';

  data: FormGroup;
  editUserSubscription!: Subscription;
  profileSubscription!: Subscription;

  constructor(private doctorService: DoctorService, private passwordService: PasswordPanelService){
    this.data = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      password: new FormControl({value: 'password', disabled: true}, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile = () => {
    this.profileSubscription = this.doctorService.getProfile().subscribe({
      next: (res: User) =>{
        if(res.id){
          this.chargeData(res);
          this.chargeProfile();
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updateUser(){
    if(this.verifyFields()){
      this.editUserSubscription = this.doctorService.updateUser(this.data.value.id, this.data.value).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Perfil actualizado');
          }else{
            this.setMessage('El perfil no puedo ser actualizado');
          }
          this.getProfile();
        },
        error: (err: any) => {
          this.setMessage('El perfil no puedo ser actualizado');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  chargeProfile = () => {
    this.doctorService.emitLoadPerfil();
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
    });
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

  changePassword = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      id: NaN,
      own: true,
    }
    this.passwordService.emitDataPassword(data);
  }

  ngOnDestroy(): void {
    this.editUserSubscription?.unsubscribe();
    this.profileSubscription?.unsubscribe();
  }

}