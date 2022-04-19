import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Interfaces
import { Course } from '../interfaces/course.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService implements OnInit {
  
  private server: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  saveCourse(course: Course) {
    this.http.post<any>(`${this.server}/courses`, course).subscribe();
  }

  deleteCourse(courseId: number) {
    this.http.delete<any>(`${this.server}/courses/${courseId}`).subscribe();
  }
}
