import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(){}

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

}
