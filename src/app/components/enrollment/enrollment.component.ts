import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';

// Interface
import { Cicle } from '../interfaces/cicle.interface';
import { Course } from '../interfaces/course.interface';
import { User } from '../interfaces/user.interface';
import { Enrollment } from '../interfaces/enrollment.interface';

// Components
import { SaveEnrollmentComponent } from './save-enrollment/save-enrollment.component';




@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit, OnDestroy {

  ciclesSocket = webSocket(`${environment.webSocketBaseURL}/cicles`);
  coursesSocket = webSocket(`${environment.webSocketBaseURL}/courses`);
  usersSocket = webSocket(`${environment.webSocketBaseURL}/users`);
  enrollmentsSocket = webSocket(`${environment.webSocketBaseURL}/enrollments`);

  menuType: string = '';
  cicles!: Cicle[];
  courses!: Course[];
  users!: User[];
  enrollmentsSource!: Enrollment[];

  enrollments!: MatTableDataSource<Enrollment>;

  studentName = new FormControl('', [Validators.required]);
  cicleName = new FormControl('', [Validators.required]);

  foundStudents!: User[];

  selectedStudent?: User;
  selectedCicle?: Cicle;

  typeUser: number = 1;

  displayedColumns: string[] = ['groupId', 'userId', 'grade', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subject!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private enrollmentService: EnrollmentService,
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

    this.usersSocket.subscribe({
      next: this.usersHandler.bind(this),
      error: this.error.bind(this),
    });

    this.enrollmentsSocket.subscribe({
      next: this.enrollmentsHandler.bind(this),
      error: this.error.bind(this),
    });

    this.subject = this.userService.subject.subscribe(() => {
      this.updateMenuType();
    });

    // If is student
    if (this.authService.user?.roleId == 4) {

      // 1 - all students, 2 - individual
      this.typeUser = 2;
      this.selectStudent(this.authService.user);
    }

    this.updateMenuType();

  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

  saveEnrollment(enrollment: Enrollment | null) {

    this.dialog.open(SaveEnrollmentComponent, {
      data: {
        courses: this.courses,
        user: this.selectedStudent,
        cicle: this.selectedCicle,
        enrollment
      },
      width: '40%',
    });

  }

  deleteEnrollment(groupId: number) {
    this.enrollmentService.deleteEnrollment(groupId);
    this.message('Matrícula eliminada correctamente');
  }

  // Helpers
  selectStudent(student: User) {
    this.selectedStudent = student;
    this.selectedCicle = undefined;
    this.cicleName.setValue('');
    this.showStudent(student);
  }

  searchStudent(): void {
    const searchValue = this.studentName.value;
    this.foundStudents = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  showStudent(student: User): string {
    return student.name;
  }

  getStudent(userId: number) {
    return this.users.filter((user) => user.id == userId).pop()?.name;
  }

  /* ******************************************************************************* */

  selectCicle(cicle: Cicle) {

    this.updateEnrollmentsFilter(cicle.id || 0);
    this.selectedCicle = cicle;
  }

  /* ******************************************************************************* */

  getCourseName(courseId: number) {
    return this.courses.filter((course) => course.id == courseId).pop()?.name;
  }

  /* ******************************************************************************* */

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.enrollments.filter = value.trim().toLowerCase();
  }

  updateEnrollmentsFilter(cicleId: number) {
    let values: Enrollment[] = this.enrollmentsSource;

    let type = this.userService.getEnrollmentsType;

    if (type == 1 && this.typeUser == 1) {

      this.enrollments = new MatTableDataSource(values.filter(e => e.group?.cicleId == cicleId));

    } else if (type == 2 && this.typeUser == 1) {

      this.enrollments = new MatTableDataSource(values.filter(e => e.group?.cicleId == cicleId && e.user?.id == this.selectedStudent?.id));

    }else if(type == 2 && this.typeUser == 2){

      this.enrollments = new MatTableDataSource(values.filter(e => e.group?.cicleId == cicleId && e.user?.id == this.authService?.user?.id));
    }


    this.enrollments.paginator = this.paginator;
    this.enrollments.sort = this.sort;
  }

  updateMenuType() {

    let type = this.userService.getEnrollmentsType;

    if (type == 1) {

      this.menuType = 'Matrícula';
      this.displayedColumns = ['userId', 'groupId', 'grade', 'action'];

    } else if (type == 2) {

      this.menuType = 'Historial';
      this.displayedColumns = ['userId', 'groupId', 'grade'];

    }

  }

  get getEnrollmentType() {
    return this.userService.getEnrollmentsType;
  }

  get getUser() {
    return this.authService.user;
  }


  /* ******************************************************************************* */


  //Sockets handlers
  ciclesHandler(res: any) {
    this.cicles = res;
  }

  coursesHandler(res: any) {
    this.courses = res;
  }

  usersHandler(res: any) {
    let values: User[] = res;

    // Only students
    this.users = values.filter(u => u.roleId == 4);
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
