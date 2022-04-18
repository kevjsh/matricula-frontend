import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  get loginStatus() {
    return this.authService.loginStatus;
  }

  get user() {
    return this.authService.user;
  }

  home() {

    if (this.authService.loginStatus) {
      this.router.navigate(['/main']);
    } else {
      this.router.navigate(['/login']);
    }

  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('User');

    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
