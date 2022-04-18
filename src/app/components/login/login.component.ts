import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { AuthService } from '../services/auth.service';

// Interfaces
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  personId = new FormControl('1', [Validators.required]);
  password = new FormControl('1', Validators.required);
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
    
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginService(): void {

    const formStatus = this.personId.hasError('required') || this.password.hasError('required');

    if(formStatus) {
      return this.message('Por favor ingrese la información solicitada.');
    }

    this.authService.login(this.personId.value.trim(), this.password.value.trim()).subscribe({
      next: this.login.bind(this),
      error: this.error.bind(this)
    });
    
  }

  login(res: User): void {
    
    if(res){
        
      // Setting token to local storage
      localStorage.setItem('User', JSON.stringify(res));

      this.authService.updateProfile();
      this.authService.loginSucces();

      // Routing
      this.router.navigate(['main']);
    }

  }

  error(res: string){
    return this.message('Error en usuario o contraseña.');
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
