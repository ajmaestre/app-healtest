import { Component } from '@angular/core';
import { MenuTestingComponent } from './menu-testing/menu-testing.component';
import { PanelTestingComponent } from './panel-testing/panel-testing.component';

@Component({
  selector: 'app-testing-panel-patient',
  standalone: true,
  imports: [
    MenuTestingComponent,
    PanelTestingComponent,
  ],
  templateUrl: './testing-panel-patient.component.html',
  styleUrl: './testing-panel-patient.component.css'
})
export class TestingPanelPatientComponent {

}
