import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Services
import { GroupService } from '../../services/group.service';

// Interfaces
import { Course } from '../../interfaces/course.interface';
import { User } from '../../interfaces/user.interface';
import { Group } from '../../interfaces/group.interface';

export interface DialogData {
  courses: Course[],
  users: User[],
  cicleId: number,
  group?: Group
}

@Component({
  selector: 'app-save-group',
  templateUrl: './save-group.component.html',
  styleUrls: ['./save-group.component.css']
})
export class SaveGroupComponent implements OnInit {

  courses: Course[];
  users: User[];
  cicleId: number;
  group?: Group;

  courseName = new FormControl('', [Validators.required]);
  schedule = new FormControl('', [Validators.required]);
  professorName = new FormControl('', [Validators.required]);

  foundCourses: Course[] = [];
  foundProfessors: User[] = [];

  selectedCourse?: Course;
  selectedProfessor?: User;


  constructor(
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SaveGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.courses = this.data.courses;
    this.users = this.data.users;
    this.cicleId = this.data.cicleId;
    this.group = this.data.group;

  }

  ngOnInit(): void {
    if (this.group) {

      this.courseName.setValue({
        name: this.getCourse(this.group.courseId),
        id: 1,
      });

      this.schedule.setValue(this.group.schedule);

      this.professorName.setValue({
        name: this.getProfessor(this.group.professorId || 0),
        id: 1,
      });

    }
  }

  saveCicle() {
    const formStatus = this.courseName.hasError('required') || this.schedule.hasError('required')
      || this.professorName.hasError('required');

    if (formStatus) {
      return this.message('Por favor ingrese la información solicitada.')
    }

    let group: Group = {
      id: this.group?.id || 0,
      courseId: this.selectedCourse?.id || this.group?.courseId || 0,
      groupNumber: this.group?.groupNumber || 0,
      schedule: this.schedule.value,
      cicleId: this.cicleId,
      professorId: this.selectedProfessor?.id || this.group?.professorId || 0
    };

    this.groupService.saveGroup(group);
    this.dialogRef.close();
  }

  /* Helpers */

  selectCourse(course: Course) {

    this.selectedCourse = course;
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

  searchProfessor(): void {

    const searchValue = this.professorName.value;

    this.foundProfessors = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  }

  selectProfessor(user: User) {
    this.selectedProfessor = user;
    this.showProfessor(user);

  }

  showProfessor(user: User): string {
    return user.name;
  }

  getProfessor(userId: number) {
    return this.users.filter((user) => user.id == userId).pop()?.name;
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