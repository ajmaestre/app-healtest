import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { SizeList } from '../../interfaces/sizeList';
import { Subscription } from 'rxjs';
import { ResoursePanelDoctorService } from '../resourse-panel-doctor/resourse-panel-doctor.service';
import { GroupPanelDoctorService } from '../group-panel-doctor/group-panel-doctor.service';
import { PatientPanelDoctorService } from '../patient-panel-doctor/patient-panel-doctor.service';
import { QuestionPanelDoctorService } from '../question-panel-doctor/question-panel-doctor.service';
import { TestPanelDoctorService } from '../test-panel-doctor/test-panel-doctor.service';

@Component({
  selector: 'app-control-panel-doctor',
  standalone: true,
  imports: [
  ],
  templateUrl: './control-panel-doctor.component.html',
  styleUrl: './control-panel-doctor.component.css'
})
export class ControlPanelDoctorComponent implements OnInit, OnDestroy{

  countGroups: SizeList = { count: 0 };
  countPatients: SizeList = { count: 0 };
  countResourses: SizeList = { count: 0 };
  countQuestions: SizeList = { count: 0 };
  countTests: SizeList = { count: 0 };

  countGroupSubscription!: Subscription;
  countPatientSubscription!: Subscription;
  countResSubscription!: Subscription;
  countQuestSubscription!: Subscription;
  countTestSubscription!: Subscription;

  @Output() openListTest = new EventEmitter<{page: string, pageAdd: string}>();

  constructor(
    private groupService: GroupPanelDoctorService,
    private patientService: PatientPanelDoctorService,
    private resourseService: ResoursePanelDoctorService,
    private questionService: QuestionPanelDoctorService,
    private testService: TestPanelDoctorService,
  ){}
  
  ngOnInit(): void {
    this.getCountGroups();
    this.getCountPatients();
    this.getCountRes();
    this.getCountQuests();
    this.getCountTests();
  }

  openPageListGroup = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add",
    }
    this.groupService.emitGroups(data);
  }

  openPageListPatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add",
    }
    this.patientService.emitPatients(data);
  }

  openPageListResourse = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.resourseService.emitResourses(data);
  }

  openPageListQuestion = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.questionService.emitQuestions(data);
  }

  openPageListTest = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
    }
    this.testService.emitTests(data);
  }

  openPagePatient = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      user: {},
      edit: false
    }
    this.patientService.emitDataPatient(data);
  }

  openPageGroup = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      group: {},
      edit: false
    }
    this.groupService.emitDataGroup(data);
  }

  openModalAddResourse = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      resourse: {},
      edit: false
    }
    this.resourseService.emitDataResourse(data);
  }

  openModalQuestion = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      question: {},
      edit: false
    }
    this.questionService.emitDataQuestion(data);
  }

  openModalTest = () => {
    const data = {
      page: "div-form-add show", 
      pageAdd: "page-add", 
      test: {},
      edit: false
    }
    this.testService.emitDataTest(data);
  }

  getCountGroups = () => {
    this.countGroupSubscription = this.groupService.getCountGroups().subscribe({
      next: (res: SizeList) =>{
        this.countGroups = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountPatients = () => {
    this.countPatientSubscription = this.patientService.getCountPatients().subscribe({
      next: (res: SizeList) =>{
        this.countPatients = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountRes = () => {
    this.countResSubscription = this.resourseService.getCountResourses().subscribe({
      next: (res: SizeList) =>{
        this.countResourses = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountQuests = () => {
    this.countQuestSubscription = this.questionService.getCountQuestions().subscribe({
      next: (res: SizeList) =>{
        this.countQuestions = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getCountTests = () => {
    this.countTestSubscription = this.testService.getCountTests().subscribe({
      next: (res: SizeList) =>{
        this.countTests = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.countGroupSubscription?.unsubscribe();
    this.countPatientSubscription?.unsubscribe();
    this.countResSubscription?.unsubscribe();
    this.countQuestSubscription?.unsubscribe();
    this.countTestSubscription?.unsubscribe();
  }

}
