import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-page',
  standalone: true,
  imports: [],
  templateUrl: './empty-page.component.html',
  styleUrl: './empty-page.component.css'
})
export class EmptyPageComponent {

  @Input() title: string = '';
  @Input() message: string = '';

}
