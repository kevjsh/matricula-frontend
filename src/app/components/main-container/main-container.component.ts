import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
})
export class MainContainerComponent implements OnInit {
    
  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

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
  
}
