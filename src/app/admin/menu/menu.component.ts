import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy{

  profileSubscription!: Subscription;
  userData: User = {};

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.adminService.loadedPerfil$.subscribe(() => {
      this.getProfile();
    });
  }

  getProfile = () => {
    this.profileSubscription = this.adminService.getProfile().subscribe({
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
    this.adminService.closeSession();
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }

}
