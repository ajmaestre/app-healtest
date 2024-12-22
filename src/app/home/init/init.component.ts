import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-init',
  standalone: true,
  imports: [],
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent {

  @Output() newPage = new EventEmitter<{page: string, pageLogin: string}>();

  constructor(){}

  login = () => {
    this.newPage.emit({page: "div-form-login show", pageLogin: "page-login"});
  }

}
