import { ExtraOptions, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { HomeComponent } from './home/home.component';
import { adminGuard } from './auth/admin.guard';
import { doctorGuard } from './auth/doctor.guard';
import { patientGuard } from './auth/patient.guard';
import { TestingPanelPatientComponent } from './testing-panel-patient/testing-panel-patient.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'doctor', component: DoctorComponent, canActivate: [doctorGuard] },
    { path: 'patient', component: PatientComponent, canActivate: [patientGuard] },
    { path: 'testing', component: TestingPanelPatientComponent, canActivate: [patientGuard] },
    { path: '**', redirectTo: 'home' }
];


export const routesOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 64],
}
