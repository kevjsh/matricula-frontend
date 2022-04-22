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
import { GroupService } from '../services/group.service';

// Interface
import { Career } from '../interfaces/careers.interface';
import { Cicle } from '../interfaces/cicle.interface';
import { Course } from '../interfaces/course.interface';
import { Group } from '../interfaces/group.interface';
import { User } from '../interfaces/user.interface';

// Components
import { SaveGroupComponent } from './save-group/save-group.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  carreersSocket = webSocket(`${environment.webSocketBaseURL}/careers`);
  ciclesSocket = webSocket(`${environment.webSocketBaseURL}/cicles`);
  coursesSocket = webSocket(`${environment.webSocketBaseURL}/courses`);
  groupsSocket = webSocket(`${environment.webSocketBaseURL}/groups`);
  usersSocket = webSocket(`${environment.webSocketBaseURL}/users`);

  careers!: Career[];
  cicles!: Cicle[];
  coursesSource!: Course[];
  groupSource!: Group[];
  users!: User[];

  courses!: Course[];
  groups!: MatTableDataSource<Group>;

  foundCareers: Career[] = [];
  foundCourses: Course[] = [];

  careerName = new FormControl('', [Validators.required]);
  courseName = new FormControl('', [Validators.required]);
  cicleName = new FormControl('', [Validators.required]);

  selectedCareer?: Career;
  cicleSelected?: Cicle
  selectedCourse?: Course;



  displayedColumns: string[] = ['courseId', 'groupNumber', 'schedule', 'professor', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private groupService: GroupService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.carreersSocket.subscribe({
      next: this.careersHandler.bind(this),
      error: this.error.bind(this),
    });

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

    this.usersSocket.subscribe({
      next: this.usersHandler.bind(this),
      error: this.error.bind(this),
    });

  }

  saveGroup(group: Group | null) {

    this.dialog.open(SaveGroupComponent, {
      data: {
        courses: this.courses,
        users: this.users,
        cicleId: this.cicleSelected?.id,
        group
      },
      width: '40%',
    });

  }

  deleteGroup(groupId: number) {
    this.groupService.deleteGroup(groupId);
    this.message('Curso eliminado correctamente');
  }

  // Helpers
  selectCareer(career: Career) {

    this.updateCoursesFilter(career.id);
    this.selectedCareer = career;
    this.showCareer(career);
  }

  searchCareer(): void {
    const searchValue = this.careerName.value;
    this.foundCareers = this.careers.filter((career) =>
      career.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  showCareer(career: Career): string {
    return career.name;
  }

  getCareer(careerId: number) {
    return this.careers.filter((career) => career.id == careerId).pop()?.name;
  }

  /* ******************************************************************************* */

  selectCourse(course: Course) {

    this.updateGroupsFilter(course.id || 0);

    this.selectedCourse = course;
    this.showCourse(course);

  }

  searchCourse(): void {
    const searchValue = this.courseName.value;
    this.foundCourses = this.courses.filter((course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  }

  showCourse(course: Course): string {
    return course.name;
  }

  getCourse(courseId: number) {
    return this.courses.filter((course) => course.id == courseId).pop()?.name;
  }

  /* ******************************************************************************* */

  selectCicle(cicle: Cicle) {

    this.updateGroupsFilter(cicle.id || 0);
    this.courseName.setValue('');
    this.cicleSelected = cicle;
  }

  /* ******************************************************************************* */

  getProfesorName(userId: number) {
    return this.users.filter((user) => user.id == userId).pop()?.name;
  }

  /* ******************************************************************************* */

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.groups.filter = value.trim().toLowerCase();
  }

  updateCoursesFilter(careerId: number) {
    this.courses = this.coursesSource.filter(c => c.careerId == careerId);
  }

  updateGroupsFilter(courseId: number) {
    let values: Group[] = this.groupSource;

    this.groups = new MatTableDataSource(values.filter(group => group.courseId == courseId && group.cicleId == this.cicleSelected?.id));

    this.groups.paginator = this.paginator;
    this.groups.sort = this.sort;
  }

  /* ******************************************************************************* */


  //Sockets handlers
  careersHandler(res: any) {
    this.careers = res;
  }

  ciclesHandler(res: any) {
    this.cicles = res;
  }

  coursesHandler(res: any) {
    this.coursesSource = res;
  }

  groupsHandler(res: any) {
    this.groupSource = res;
    this.updateGroupsFilter(this.selectedCourse?.id || 0);
  }

  usersHandler(res: any) {
    let values: User[] = res;

    // Only professors
    this.users = values.filter(u => u.roleId == 3);
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
