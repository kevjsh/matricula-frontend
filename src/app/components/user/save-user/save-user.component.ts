import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

// Helper in date format
const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    dateA11yLabel: 'LL',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Services
import { UserService } from '../../services/user.service';

// Interfaces
import { Career } from '../../interfaces/careers.interface';
import { User } from '../../interfaces/user.interface';

export interface DialogData {
  careers: Career[];
  user?: User;
}

@Component({
  selector: 'app-save-user',
  templateUrl: './save-user.component.html',
  styleUrls: ['./save-user.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SaveUserComponent implements OnInit {
  careers: Career[];
  user?: User;

  foundCareers: Career[] = [];

  personId = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  telephone = new FormControl('', [Validators.required]);
  birthday = new FormControl('', [Validators.required]);
  careerName = new FormControl('', [Validators.required]);

  roleName = new FormControl('', [Validators.required]);
  roles: string[] = ['Administrador', 'Matriculador', 'Profesor', 'Alumno'];

  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  selectedCareer?: Career;
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SaveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.careers = this.data.careers;
    this.user = this.data.user;
  }

  ngOnInit(): void {
    if (this.user) {
      this.personId.setValue(this.user.personId);
      this.name.setValue(this.user.name);
      this.telephone.setValue(this.user.telephone);
      if(this.user.birthday){
        this.birthday.setValue(moment(new Date(this.user.birthday?.toString() || ""), "YYYY-MM-DD"));
      }
      this.careerName.setValue({
        name: this.getCareer(this.user.careerId || 0),
        id: 1,
      });

      this.roleName.setValue(this.getRolName(this.user.roleId || 0));
      this.email.setValue(this.user.email);
      console.log(this.user.email)
    }
  }

  addUser() {

    let password:string|undefined;
    let formStatus = this.personId.hasError('required') || this.name.hasError('required') 
    || this.telephone.hasError('required') || this.birthday.hasError('required') || this.roleName.hasError('required') 
    || this.email.hasError('required');

    if(this.roleName.value == 'Alumno'){
      formStatus = formStatus || this.careerName.hasError('required');
    }

    if(this.password.value == ''){
      password = this.user?.password;
    }else{
      password = this.password.value;
    }

    if(formStatus) {
      return this.message('Por favor ingrese la información solicitada.');
    }

    let user: User = {
      id: this.user?.id || 0,
      personId: this.personId.value,
      name: this.name.value,
      telephone: this.telephone.value,
      birthday: this.birthday.value.format('YYYY-MM-DD'),
      careerId: this.selectedCareer?.id || this.user?.careerId,
      roleId: this.getRolId(this.roleName.value),
      email: this.email.value,
      password,
    };

    this.userService.saveUser(user);
    this.dialogRef.close();
    this.message('Actualización correcta');
  }

  selectCareer(career: Career) {
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

  getRolName(rolId: number) {
    return this.roles[rolId - 1];
  }

  getRolId(rolName: string) {
    if (rolName == 'Administrador') return 1;
    if (rolName == 'Matriculador') return 2;
    if (rolName == 'Profesor') return 3;
    return 4;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Messages
  message(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar'],
    });
  }
}
