import { Component } from '@angular/core';
import { MenuPatientComponent } from './menu-patient/menu-patient.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { TestPanelPatientComponent } from './test-panel-patient/test-panel-patient.component';
import { ResoursePanelPatientComponent } from './resourse-panel-patient/resourse-panel-patient.component';
import { ResultPanelPatientComponent } from './result-panel-patient/result-panel-patient.component';
import { PerfilDataPatientComponent } from './perfil-data-patient/perfil-data-patient.component';
import { PasswordPanelComponent } from '../password-panel/password-panel.component';
import { ActivityPanelPatientComponent } from './activity-panel-patient/activity-panel-patient.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    MenuPatientComponent,
    ControlPanelComponent,
    TestPanelPatientComponent,
    ResoursePanelPatientComponent,
    ResultPanelPatientComponent,
    ActivityPanelPatientComponent,
    PerfilDataPatientComponent,
    PasswordPanelComponent,
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

}
