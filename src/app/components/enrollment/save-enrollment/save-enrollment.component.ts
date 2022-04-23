import { Component, OnInit, Inject } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


// Services
import { EnrollmentService } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';

// Interfaces
import { Course } from '../../interfaces/course.interface';
import { User } from '../../interfaces/user.interface';
import { Group } from '../../interfaces/group.interface';
import { Enrollment } from '../../interfaces/enrollment.interface';
import { Cicle } from '../../interfaces/cicle.interface';

export interface DialogData {
  courses: Course[],
  user: User,
  cicle: Cicle,
  enrollment: Enrollment
}

@Component({
  selector: 'app-save-enrollment',
  templateUrl: './save-enrollment.component.html',
  styleUrls: ['./save-enrollment.component.css']
})
export class SaveEnrollmentComponent implements OnInit {

  groupsSocket = webSocket(`${environment.webSocketBaseURL}/groups`);

  courses!: Course[];
  groupSource!: Group[];
  groups!: Group[];
  user!: User;
  cicle!: Cicle;

  enrollment?: Enrollment;

  studentName = new FormControl('', [Validators.required]);
  cicleName = new FormControl('', [Validators.required]);
  courseName = new FormControl('', [Validators.required]);
  groupName = new FormControl('', [Validators.required]);

  foundCourses: Course[] = [];
  selectedCourse?: Course;
  selectedGroup?: Group;


  constructor(
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SaveEnrollmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.courses = this.data.courses;
    this.user = this.data.user;
    this.cicle = this.data.cicle;
    this.enrollment = this.data.enrollment;

    // Only relevant courses
    this.courses = this.courses.filter(course => course.careerId == this.user.careerId);
    if (this.enrollment) {
      this.selectedCourse = { id: this.enrollment.group?.courseId, name: "" };
    }

  }

  ngOnInit(): void {

    this.groupsSocket.subscribe({
      next: this.groupsHandler.bind(this),
      error: this.error.bind(this),
    });

    this.studentName.setValue(this.user.name);
    this.cicleName.setValue(`${this.cicle.year} - ${this.cicle.cicleNumber}`);

    if (this.enrollment) {

      this.courseName.setValue({
        name: this.getCourse(this.enrollment.group?.courseId || 0),
        id: 1,
      });
    }
  }

  saveEnrollment() {

    const formStatus = this.courseName.hasError('required') || this.groupName.hasError('required');

    if (formStatus) {
      return this.message('Por favor ingrese la información solicitada.')
    }

    let enrollment: Enrollment = {
      id: this.enrollment?.id || 0,
      group: {id: this.selectedGroup?.id, courseId: 0},
      user: {id:this.user.id, name: ""},
      grade: this.enrollment?.grade,
    };

    this.enrollmentService.saveEnrollment(enrollment);
    this.dialogRef.close();
    this.message('Matrícula ingresada correctamente');
  }

  /* Helpers */

  get getUser(){
    return this.authService.user;
  }

  selectCourse(course: Course) {

    this.selectedCourse = course;
    this.updateGroupsFilter();
    this.showCourse(course);

  }

  showCourse(course: Course): string {
    return course.name;
  }

  searchCourse(): void {
    const searchValue = this.courseName.value;
    this.foundCourses = this.courses.filter((course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  }

  getCourse(courseId: number) {
    return this.courses.filter((course) => course.id == courseId).pop()?.name;
  }

  /* ******************************************************************************* */

  selectGroup(group: Group) {
    this.selectedGroup = group;
  }

  /* ******************************************************************************* */

  getCourseName(courseId: number) {
    return this.courses.filter((course) => course.id == courseId).pop()?.name;
  }

  /* ******************************************************************************* */

  updateGroupsFilter() {
    let values: Group[] = this.groupSource;
    this.groups = values.filter(group => group.courseId == this.selectedCourse?.id && group.cicleId == this.cicle?.id);
  }

  /* ******************************************************************************* */

  //Sockets handlers
  groupsHandler(res: any) {
    this.groupSource = res;
    this.updateGroupsFilter();
  }

  error(res: any) {
    this.message('Error');
  }

  /* ******************************************************************************* */

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Messages
  message(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar']
    });
  }
}
