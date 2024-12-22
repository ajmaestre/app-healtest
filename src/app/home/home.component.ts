import { Component } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { InitComponent } from './init/init.component';
import { UsComponent } from './us/us.component';
import { ObjetivsComponent } from './objetivs/objetivs.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavComponent, 
    InitComponent, 
    UsComponent, 
    ObjetivsComponent, 
    LoginComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  loadClass: string = "div-form-login hide";
  loadClassTwo: string = "page-login";

  loadLogin(styles: {page: string, pageLogin: string}) {
    this.loadClass = styles.page;
    this.loadClassTwo = styles.pageLogin;
  }

}
