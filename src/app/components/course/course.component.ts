import {Component, OnInit, ViewChild} from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

// Services
import { CourseService } from '../services/course.service';

// Interface
import { Career } from '../interfaces/careers.interface';
import { Course } from '../interfaces/course.interface';

// Components
import { SaveCourseComponent } from './save-course/save-course.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  careers!: Career[];
  courses!: MatTableDataSource<Course>;

  carreersSocket = webSocket(`${environment.webSocketBaseURL}/careers`);
  coursesSocket = webSocket(`${environment.webSocketBaseURL}/courses`);
  
  displayedColumns: string[] = ['code', 'name', 'credits','hours','careerId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService:CourseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.carreersSocket.subscribe({
      next: this.careersHandler.bind(this),
      error: this.error.bind(this),
    });

    this.coursesSocket.subscribe({
      next: this.coursesHandler.bind(this),
      error: this.error.bind(this),
    });
  }

  addCourse(course:Course | null){

    this.dialog.open(SaveCourseComponent,{
      data: {
        careers: this.careers,
        course
      },
      width: '40%',
    });

  }

  deleteCourse(courseId:number){
    this.courseService.deleteCourse(courseId);
    this.message('Curso eliminado correctamente');
  }

  getCareer(careerId:number){
    return this.careers.filter(career => career.id == careerId).pop()?.name;
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.courses.filter = value.trim().toLowerCase();
  }

  //Sockets handlers
  careersHandler(res: any) {
    this.careers = res;
  }

  coursesHandler(res: any) {

    this.courses = new MatTableDataSource(res);
    this.courses.paginator = this.paginator;
    this.courses.sort = this.sort;
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