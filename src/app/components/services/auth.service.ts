import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Intefaces
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loginStatus: boolean = false;
  private _user?: User;

  private server: string = environment.baseUrl;

  constructor(private http: HttpClient) {
    
    /* Case reloading page*/
    const token: string = localStorage.getItem('User') || '';
    if (token != '') {
      this._loginStatus = true;
      this.updateProfile();
    }
    
  }

  get user() {
    return this._user;
  }

  get loginStatus() {
    let state: boolean = this._loginStatus;
    return state;
  }

  /* Manage sessions*/
  login(personId: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.server}/login`, { personId, password });
  }

  loginSucces() {
    this._loginStatus = true;
  }

  logout() {
    this.http.delete<User>(`${this.server}/login`).subscribe();
    this._loginStatus = false;
  }

  updateProfile(){
    let info = localStorage.getItem('User') || '';

    /* Decode and extract token values (user) */
    this._user = JSON.parse(info);
  }

}
