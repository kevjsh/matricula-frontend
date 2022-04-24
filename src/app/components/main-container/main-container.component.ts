import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
})
export class MainContainerComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['login']);
  }

  get user() {
    return this.authService.user;
  }

  get loginStatus() {
    return this.authService.loginStatus;
  }

  goToUsers(type: number) {
    this.userService.setUsersTypeFilter(type);
    this.router.navigate(['users']);
  }

  goToEnrollments(type: number) {
    this.userService.setEnrollmentsType(type);
    this.router.navigate(['enrollment']);
  }

}
