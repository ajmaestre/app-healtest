import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { PatientService } from '../../patient/patient.service';
import { Group } from '../../interfaces/group';
import { NgIf } from '@angular/common';
import { TestingPanelPatientService } from '../testing-panel-patient.service';
import { Test } from '../../interfaces/test';
import { Response } from '../../interfaces/response';

@Component({
  selector: 'app-menu-testing',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './menu-testing.component.html',
  styleUrl: './menu-testing.component.css'
})
export class MenuTestingComponent implements OnInit, OnDestroy{

  profileSubscription!: Subscription;
  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;
  stateSubscription!: Subscription;

  userData: User = {};
  testData: Test = {};


  constructor(private testingService: TestingPanelPatientService){}

  ngOnInit(): void {
    this.testingService.loadedData$.subscribe((dataSent) => {
      if(dataSent.test){
        this.chargeData(dataSent.test);
        this.getProfile();
      }
    });
  }

  getProfile = () => {
    this.profileSubscription = this.testingService.getProfile().subscribe({
      next: (res: User) =>{
        this.userData = res;
        this.getGroupByPatient(this.userData);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGroupByPatient = (user: User) => {
    if(user.id){
      this.groupsSubscription = this.testingService.getGroupByPatient(user.id).subscribe({
        next: (res: Group) =>{
          if(res){
            user.groups = [res];
            this.getMonitorName(user, res);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getMonitorName = (user: User, group: Group) => {
    if(group?.user_id){
      this.doctorsSubscription = this.testingService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          user.monitor = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getState = (test: Test) => {
    if(test.id){
      this.stateSubscription = this.testingService.getStateTest(test.id).subscribe({
        next: (res: Response) =>{
          if(res){
            test.state = res.response;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  chargeData(dataSent: Test) {
    this.testData = dataSent;
    this.getState(this.testData);
    this.formatDate(this.testData);
  }

  formatDate = (test: Test) => {
    if(test.dateend && test.dateinit){
      test.dateend = new Date(test.dateend);
      test.dateinit = new Date(test.dateinit);
    }
  }

  getDateInit(test: Test){
    if(test.dateinit?.getMonth())
      return `${test.dateinit?.getFullYear()}/${test.dateinit?.getMonth()+1}/${test.dateinit?.getDate()}`;
    return `${test.dateinit?.getFullYear()}/${test.dateinit?.getMonth()}/${test.dateinit?.getDate()}`;
  }

  getDateEnd(test: Test){
    if(test.dateend?.getMonth())
      return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()+1}/${test.dateend?.getDate()}`;
    return `${test.dateend?.getFullYear()}/${test.dateend?.getMonth()}/${test.dateend?.getDate()}`;
  }
  
  scrollTo(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;
    const fragment = target.getAttribute('fragment');
    if (fragment) {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    const links = document.querySelectorAll('ul li a');
    links.forEach(link => link.classList.remove('active'));
    target.classList.add('active');
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }

}
