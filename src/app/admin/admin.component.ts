import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DoctorPanelComponent } from './doctor-panel/doctor-panel.component';
import { PatientPanelComponent } from './patient-panel/patient-panel.component';
import { AddPatientComponent } from './patient-panel/add-patient/add-patient.component';
import { PanelConfirmComponent } from '../panel-confirm/panel-confirm.component';
import { PerfilPanelComponent } from './perfil-panel/perfil-panel.component';
import { PasswordPanelComponent } from '../password-panel/password-panel.component';
import { GroupPanelComponent } from './group-panel/group-panel.component';
import { AddGroupComponent } from './group-panel/add-group/add-group.component';
import { DoctorListPanelComponent } from './doctor-panel/doctor-list-panel/doctor-list-panel.component';
import { PatientListPanelComponent } from './patient-panel/patient-list-panel/patient-list-panel.component';
import { GroupListPanelComponent } from './group-panel/group-list-panel/group-list-panel.component';
import { PatientDataComponent } from './patient-panel/patient-data/patient-data.component';
import { GroupDataComponent } from './group-panel/group-data/group-data.component';

@Component({
  selector: 'app-admin',
  standalone: true, 
  imports: [
    MenuComponent,
    AdminPanelComponent,
    DoctorPanelComponent,
    PatientPanelComponent,
    GroupPanelComponent,
    PerfilPanelComponent,
    AddPatientComponent,
    AddGroupComponent,
    PanelConfirmComponent,
    PasswordPanelComponent,
    DoctorListPanelComponent,
    PatientListPanelComponent,
    GroupListPanelComponent,
    PatientDataComponent,
    GroupDataComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

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
