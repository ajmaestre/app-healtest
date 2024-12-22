import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { IsAuth } from '../interfaces/isAuth';
import { NgIf } from '@angular/common';
import { PasswordPanelService } from './password-panel.service';

@Component({
  selector: 'app-password-panel',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './password-panel.component.html',
  styleUrl: './password-panel.component.css'
})
export class PasswordPanelComponent implements OnInit, OnDestroy{

  page: string = 'div-form-add hide';
  pageAdd: string = '';
  id!: number;

  divWarning: string = 'div-warning hide';
  message:string = '';

  data: FormGroup;
  changePasswordSubscription!: Subscription;
  own: boolean = false;

  constructor(private passwordService: PasswordPanelService){
    this.data = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.passwordService.dataPassword$.subscribe((dataSended) => {
      this.page = dataSended.page;
      this.pageAdd = dataSended.pageAdd;
      this.id = dataSended.id;
      this.own = dataSended.own;  
      if(!this.own){
        this.data.get('oldPassword')?.setValue('password');
        this.data.get('oldPassword')?.disable();
      }else{
        this.data.get('oldPassword')?.setValue('');
        this.data.get('oldPassword')?.enable();
      }
    });
  }

  change = () => {
    if(this.own){
      this.changeOwnPassword();
    }else{
      this.changePassword();
    }
  }

  changePassword = () => {
    if(this.verifyFields()){
      this.changePasswordSubscription = this.passwordService.changePasswordAdmin(this.id, this.data.value.newPassword).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Contraseña actualizada.');
            this.clearForm(); 
          }else{
            this.setMessage('La contraseña no pudo ser actualizada.');
          }
        },
        error: (err: any) => {
          this.setMessage('La contraseña no pudo ser actualizada.');
        }
      });
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  changeOwnPassword = () => {
    if(this.verifyFields()){
      this.changePasswordSubscription = this.passwordService.changePassword(this.data.value.newPassword, this.data.value.oldPassword).subscribe({
        next: (res: IsAuth) =>{
          if(res.response){
            this.setMessage('Contraseña actualizada.');
            this.clearForm(); 
          }else{
            this.setMessage('Las contraseña anterior no es correcta.');
          }
        },
        error: (err: any) => {
          this.setMessage('La contraseña no pudo ser actualizada.');
        }
      });
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  closeModal = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add page-out", 
      id: NaN,
      own: this.own,
    }
    this.passwordService.emitDataPassword(data);
    setTimeout(() => {
      data.page = "div-form-add hide";
      data.pageAdd = "page-add page-out";
      this.passwordService.emitDataPassword(data);
    }, 500);
  }

  verifyFields = ():boolean => {
    if((this.data.value.newPassword == '') || 
        (this.data.value.oldPassword == '')){
      return false;
    }
    return true;
  }

  setMessage = (text: string) => {
    this.message = text;
    this.divWarning = 'div-warning show';
    setInterval(() => {
      this.divWarning = 'div-warning hide';
    }, 3500);
  }

  clearForm(){
    this.data.setValue({
      newPassword: '',
      oldPassword: '',
    });
  }

  ngOnDestroy(): void {
    this.changePasswordSubscription?.unsubscribe();
  }

}
