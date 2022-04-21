import {Component, OnInit, ViewChild} from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

// Services
import { CicleService } from '../services/cicle.service';

// Interface
import { Cicle } from '../interfaces/cicle.interface';

// Components
import { SaveCicleComponent } from './save-cicle/save-cicle.component';

@Component({
    selector: 'app-cicle',
    templateUrl: './cicle.component.html',
    styleUrls: ['./cicle.component.css']
})
export class CicleComponent implements OnInit{
    cicles!: MatTableDataSource<Cicle>;

    ciclesSocket = webSocket(`${environment.webSocketBaseURL}/cicles`);

    displayedColumns: string[] = ['year','cicleNumber','initDate','finishDate','action'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private cicleService: CicleService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.ciclesSocket.subscribe({
            next: this.cicleHandler.bind(this),
            error: this.error.bind(this),
        });
    }

    addCicle(cicle:Cicle | null){
        this.dialog.open(SaveCicleComponent,{
            data: {
                cicle
            },
            width: '40%',
        });
    }

    deleteCicle(cicleId:number){
        this.cicleService.deleteCicle(cicleId);
        this.message('Ciclo eliminado correctamente');
    }

    filter(event: Event){
        const value = (event.target as HTMLInputElement).value;
        this.cicles.filter = value.trim().toLocaleLowerCase();
    }

    // Sockets handlers
    cicleHandler(res: any){
        this.cicles = new MatTableDataSource(res);
        this.cicles.paginator = this.paginator;
        this.cicles.sort = this.sort;
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