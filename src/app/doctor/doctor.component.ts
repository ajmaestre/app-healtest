import { Component } from '@angular/core';
import { MenuPanelDoctorComponent } from './menu-panel-doctor/menu-panel-doctor.component';
import { ControlPanelDoctorComponent } from './control-panel-doctor/control-panel-doctor.component';
import { PatientPanelDoctorComponent } from './patient-panel-doctor/patient-panel-doctor.component';
import { PanelConfirmComponent } from '../panel-confirm/panel-confirm.component';
import { GroupPanelDoctorComponent } from './group-panel-doctor/group-panel-doctor.component';
import { PerfilPanelDoctorComponent } from './perfil-panel-doctor/perfil-panel-doctor.component';
import { PasswordPanelComponent } from '../password-panel/password-panel.component';
import { ResoursePanelDoctorComponent } from './resourse-panel-doctor/resourse-panel-doctor.component';
import { QuestionPanelDoctorComponent } from './question-panel-doctor/question-panel-doctor.component';
import { TestPanelDoctorComponent } from './test-panel-doctor/test-panel-doctor.component';
import { StatisticPanelDoctorComponent } from './statistic-panel-doctor/statistic-panel-doctor.component';
import { ActivityPanelDoctorComponent } from './activity-panel-doctor/activity-panel-doctor.component';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    MenuPanelDoctorComponent,
    ControlPanelDoctorComponent,
    PatientPanelDoctorComponent,
    GroupPanelDoctorComponent,
    ResoursePanelDoctorComponent,
    QuestionPanelDoctorComponent,
    TestPanelDoctorComponent,
    ActivityPanelDoctorComponent,
    StatisticPanelDoctorComponent,
    PerfilPanelDoctorComponent,
    PasswordPanelComponent,
    PanelConfirmComponent,
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {

  loadModalConfirm: string = "div-form-add hide";
  loadConfirmAnim: string = "page-add";
  getElementId!: number;
  getTypeElement: string = "";


  loadPageConfirm(styles: {page: string, pageAdd: string, elementId: number, typeElement: string}) {
    this.loadModalConfirm = styles.page;
    this.loadConfirmAnim = styles.pageAdd;
    this.getElementId = styles.elementId;
    this.getTypeElement = styles.typeElement;
  }

}
