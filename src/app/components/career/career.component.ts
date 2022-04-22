import {Component, OnInit, ViewChild} from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

// Services 
import { CareerService } from '../services/career.service';

// Interface
import { Career } from '../interfaces/careers.interface';

// Components
import { SaveCareerComponent } from './save-career/save-career.component';

@Component({
    selector: 'app-career',
    templateUrl: './career.component.html',
    styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
    careers!: MatTableDataSource<Career>;

    careersSocket = webSocket(`${environment.webSocketBaseURL}/careers`);

    displayedColumns: string[] = ['code','name','title','action'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private careerService: CareerService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.careersSocket.subscribe({
            next: this.careerHandler.bind(this),
            error: this.error.bind(this),
        });
    }

    addCareer(career:Career | null){
        this.dialog.open(SaveCareerComponent,{
            data: {
                career
            },
            width: '40%',
        });
    }

    deleteCareer(careerId:number){
        this.careerService.deleteCareer(careerId);
        this.message('Carrera eliminada correctamente');
    }

    filter(event: Event){
        const value = (event.target as HTMLInputElement).value;
        this.careers.filter = value.trim().toLocaleLowerCase();
    }

    // Sockets handlers
    careerHandler(res: any){
        this.careers = new MatTableDataSource(res);
        this.careers.paginator = this.paginator;
        this.careers.sort = this.sort;
    }

    error(res: any){
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