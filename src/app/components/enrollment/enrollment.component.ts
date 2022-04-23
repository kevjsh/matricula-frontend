import { Component, OnInit, ViewChild } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

// Services
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
export class EnrollmentComponent implements OnInit {

  ciclesSocket = webSocket(`${environment.webSocketBaseURL}/cicles`);
  coursesSocket = webSocket(`${environment.webSocketBaseURL}/courses`);
  usersSocket = webSocket(`${environment.webSocketBaseURL}/users`);
  enrollmentsSocket = webSocket(`${environment.webSocketBaseURL}/enrollments`);

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

  displayedColumns: string[] = ['groupId', 'userId', 'grade', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
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

    this.enrollments = new MatTableDataSource(values.filter(e => e.group?.cicleId == cicleId));

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
