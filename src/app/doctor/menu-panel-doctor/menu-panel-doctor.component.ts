import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-menu-panel-doctor',
  standalone: true,
  imports: [],
  templateUrl: './menu-panel-doctor.component.html',
  styleUrl: './menu-panel-doctor.component.css'
})
export class MenuPanelDoctorComponent implements OnInit, OnDestroy{

  profileSubscription!: Subscription;
  userData: User = {};

  constructor(private doctorService: DoctorService){}

  ngOnInit(): void {
    this.doctorService.loadedPerfil$.subscribe(() => {
      this.getProfile();
    });
  }

  getProfile = () => {
    this.profileSubscription = this.doctorService.getProfile().subscribe({
      next: (res: User) =>{
        this.userData = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
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
    this.doctorService.closeSession();
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }

}
