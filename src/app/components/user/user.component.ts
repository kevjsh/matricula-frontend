import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

// Services
import { UserService } from '../services/user.service';

// Interface
import { Career } from '../interfaces/careers.interface';
import { User } from '../interfaces/user.interface';

// Components
import { SaveUserComponent } from './save-user/save-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  careers!: Career[];
  usersSource!: User[];
  users!: MatTableDataSource<User>;
  menuType: string = "";

  carreersSocket = webSocket(`${environment.webSocketBaseURL}/careers`);
  usersSocket = webSocket(`${environment.webSocketBaseURL}/users`);

  displayedColumns?: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subject!: Subscription;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.carreersSocket.subscribe({
      next: this.careersHandler.bind(this),
      error: this.error.bind(this),
    });

    this.usersSocket.subscribe({
      next: this.usersHandler.bind(this),
      error: this.error.bind(this),
    });

    this.subject = this.userService.subject.subscribe(() => {
      this.updateFilter();
    });

  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

  saveUser(user: User | null) {

    this.dialog.open(SaveUserComponent, {
      data: {
        careers: this.careers,
        user
      },
      width: '40%',
    });

  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId);
    this.message('Usuario eliminado correctamente');
  }

  getCareer(careerId: number) {
    return this.careers.filter(career => career.id == careerId).pop()?.name;
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.users.filter = value.trim().toLowerCase();
  }

  //Sockets handlers
  careersHandler(res: any) {
    this.careers = res;
  }

  public usersHandler(res: any) {
    this.usersSource = res;
    this.updateFilter();

  }

  updateFilter() {
    let values: User[] = this.usersSource;
    let filter = this.userService.usersTypeFilter;

    if (filter == 1) {

      this.menuType = 'Profesores';
      this.displayedColumns = ['personId', 'name', 'telephone', 'birthday', 'email', 'action'];
      this.users = new MatTableDataSource(values.filter(e => e.roleId == 3));

    } else if (filter == 2) {

      this.menuType = 'Alumnos';
      this.displayedColumns = ['personId', 'name', 'telephone', 'birthday', 'email', 'careerId', 'action'];
      this.users = new MatTableDataSource(values.filter(e => e.roleId == 4));

    } else if (filter == 3) {

      this.menuType = 'Seguridad';
      this.displayedColumns = ['personId', 'name', 'telephone', 'birthday', 'email', 'action'];
      this.users = new MatTableDataSource(values.filter(e => e.roleId == 1 || e.roleId == 2));

    }

    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
  }

  get userTypes() {
    return this.userService.usersTypeFilter;
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