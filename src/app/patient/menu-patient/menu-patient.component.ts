import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { PatientService } from '../patient.service';
import { Group } from '../../interfaces/group';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-menu-patient',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
  ],
  templateUrl: './menu-patient.component.html',
  styleUrl: './menu-patient.component.css'
})
export class MenuPatientComponent implements OnInit, OnDestroy{

  profileSubscription!: Subscription;
  groupsSubscription!: Subscription;
  doctorsSubscription!: Subscription;

  userData: User = {};


  constructor(private patientService: PatientService){}

  ngOnInit(): void {
    this.patientService.loadedPerfil$.subscribe(() => {
      this.getProfile();
    });
  }

  getProfile = () => {
    this.profileSubscription = this.patientService.getProfile().subscribe({
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
      this.groupsSubscription = this.patientService.getGroupByPatient(user.id).subscribe({
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
      this.doctorsSubscription = this.patientService.getMonitorById(group.user_id).subscribe({
        next: (res: User) =>{
          user.monitor = `${res.name} ${res.lastname}`;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
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

  logOut = () => {
    this.patientService.closeSession();
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
    this.groupsSubscription?.unsubscribe();
  }

}
