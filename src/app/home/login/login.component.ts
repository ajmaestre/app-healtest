import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';
import { Session } from '../../interfaces/session';
import { HttpClientModule } from '@angular/common/http';
import { Token } from '../../interfaces/token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{

  data: FormGroup;
  sessionSubscription!: Subscription;
  adminSubscription!: Subscription;
  doctorSubscription!: Subscription;
  patientSubscription!: Subscription;
  session!: Session;
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  isPatient: boolean = false;
  divWarning: string = 'div-warning hide';
  message:string = '';

  @Input() page: string = '';
  @Input() pageLogin: string = '';
  @Output() closePage = new EventEmitter<{page: string, pageLogin: string}>();

  constructor(private router: Router, private loginService: LoginService){
    this.data = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
      
  }

  closeLogin = () => {
    this.closePage.emit({page: "div-form-login show", pageLogin: "page-login page-logout"});
    setTimeout(() => {
      this.closePage.emit({page: "div-form-login hide", pageLogin: "page-login page-logout"});
    }, 500);
  }

  getSession(){
    if(this.verifyFields()){
      this.session = this.data.value;
      this.sessionSubscription = this.loginService.getSession(this.session).subscribe({
        next: (res: Token) =>{
          if(res.token){
            this.clearForm(); 
            this.loginService.setToken(res.token);
            this.verifyRole();
          }else{
            this.setMessage('Credenciales incorrectas');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.setMessage('Credenciales incorrectas');
        }
      }); 
    }else{
      this.setMessage('Debe rellenar todos los campos');
    }
  }

  verifyRole = () => {
    this.verifyAdmin();
    this.verifyPatient();
    this.verifyDoctor();
  }

  verifyAdmin = () => {
    this.adminSubscription = this.loginService.isAdmin().subscribe({
      next: (res: boolean) =>{
        this.isAdmin = res;
        if(this.isAdmin){
          this.router.navigate(['/admin']);
        }
      },
      error: (err: any) => {
        this.isAdmin = false;
      }
    });
  }

  verifyPatient = () => {
    this.patientSubscription = this.loginService.isPatient().subscribe({
      next: (res: boolean) =>{
        this.isPatient = res;
        if(this.isPatient){
          this.router.navigate(['/patient']);
        }
      },
      error: (err: any) => {
        this.isPatient = false;
      }
    });
  }

  verifyDoctor = () => {
    this.doctorSubscription = this.loginService.isDoctor().subscribe({
      next: (res: boolean) =>{
        this.isDoctor = res;
        if(this.isDoctor){
          this.router.navigate(['/doctor']);
        }
      },
      error: (err: any) => {
        this.isDoctor = false;
      }
    });
  }

  verifyFields = ():boolean => {
    if((this.data.value.email == '') || (this.data.value.username == '') || (this.data.value.password == '')){
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
      email: '',
      username: '',
      password: ''
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
    this.doctorSubscription.unsubscribe();
    this.patientSubscription.unsubscribe();
  }

}
