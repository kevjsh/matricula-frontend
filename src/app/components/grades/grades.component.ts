import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

// Services
import { AuthService } from '../services/auth.service';

// Interface
import { Group } from '../interfaces/group.interface';
import { Cicle } from '../interfaces/cicle.interface';
import { Course } from '../interfaces/course.interface';
import { User } from '../interfaces/user.interface';
import { Enrollment } from '../interfaces/enrollment.interface';

// Components
import { SaveGradeComponent } from './save-grade/save-grade.component';


@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {

  ciclesSocket = webSocket(`${environment.webSocketBaseURL}/cicles`);
  coursesSocket = webSocket(`${environment.webSocketBaseURL}/courses`);
  groupsSocket = webSocket(`${environment.webSocketBaseURL}/groups`);
  enrollmentsSocket = webSocket(`${environment.webSocketBaseURL}/enrollments`);

  cicles!: Cicle[];
  courses!: Course[];
  users!: User[];
  groupSource!: Group[];
  groups!: Group[];
  enrollmentsSource!: Enrollment[];

  enrollments!: MatTableDataSource<Enrollment>;

  studentName = new FormControl('', [Validators.required]);
  cicleName = new FormControl('', [Validators.required]);
  groupName = new FormControl('', [Validators.required]);


  foundStudents!: User[];

  selectedStudent?: User;
  selectedCicle?: Cicle;
  selectedGroup?: Group;

  displayedColumns: string[] = ['userId', 'groupId', 'grade', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subject!: Subscription;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.ciclesSocket.subscribe({
      next: this.ciclesHandler.bind(this),
      error: this.error.bind(this),
    });

    this.coursesSocket.subscribe({
      next: this.coursesHandler.bind(this),
      error: this.error.bind(this),
    });

    this.groupsSocket.subscribe({
      next: this.groupsHandler.bind(this),
      error: this.error.bind(this),
    });

    this.enrollmentsSocket.subscribe({
      next: this.enrollmentsHandler.bind(this),
      error: this.error.bind(this),
    });

  }

  saveEnrollment(enrollment: Enrollment) {

    this.dialog.open(SaveGradeComponent, {
      data: {
        enrollment
      },
      width: '40%',
    });

  }

  // Helpers

  /* ******************************************************************************* */

  selectCicle(cicle: Cicle) {

    this.selectedCicle = cicle;
    this.selectedGroup = undefined;
    this.groupName.setValue('');
    
    this.updateGroupsFilter();
  }

  /* ******************************************************************************* */

  getCourseName(courseId: number) {
    return this.courses.filter((course) => course.id == courseId).pop()?.name;
  }

  /* ******************************************************************************* */

  selectGroup(group: Group) {
    this.selectedGroup = group;
    this.updateEnrollmentsFilter(group.id || 0);
  }

  updateGroupsFilter() {
    let values: Group[] = this.groupSource;
    this.groups = values.filter(group => group.cicleId == this.selectedCicle?.id);
  }

   /* ******************************************************************************* */

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.enrollments.filter = value.trim().toLowerCase();
  }

  updateEnrollmentsFilter(groupId: number) {
    let values: Enrollment[] = this.enrollmentsSource;

    this.enrollments = new MatTableDataSource(values.filter(e => e.group?.id == groupId));

    this.enrollments.paginator = this.paginator;
    this.enrollments.sort = this.sort;
  }

  /* ******************************************************************************* */

  //Sockets handlers
  ciclesHandler(res: any) {
    this.cicles = res;
  }

  coursesHandler(res: any) {
    this.courses = res;
  }

  groupsHandler(res: any) {
    let values: Group[] = res;
    this.groupSource = values.filter(group => group.professorId == this.authService.user?.id);
  }

  enrollmentsHandler(res: any) {
    this.enrollmentsSource = res;
    this.updateEnrollmentsFilter(this.selectedCicle?.id || 0);
  }

  error(res: any) {
    this.message('Error');
  }

  message(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar']
    });
  }

}
