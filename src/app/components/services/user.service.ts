import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interfaces
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  
  private server: string = environment.baseUrl;
  private usersType:number = 1;
  private enrollmentsType:number = 1;
  
  subject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  saveUser(user: User) {
    this.http.post<any>(`${this.server}/users`, user).subscribe();
  }

  deleteUser(userId: number) {
    this.http.delete<any>(`${this.server}/users/${userId}`).subscribe();
  }

  setUsersTypeFilter(type:number){
    
    // 1 - Profesores, 2 - Alumnos, 3 - Seguridad
    this.usersType = type;

    // to continue getting updates
    this.subject.next(type);
  }

  setEnrollmentsType(type:number){
    
    // 1 - Enrollment, 2 - Enrollment History
    this.enrollmentsType = type;

    // to continue getting updates
    this.subject.next(type);
  }

  get usersTypeFilter(){
    return this.usersType;
  }

  get getEnrollmentsType(){
    return this.enrollmentsType;
  }

}
