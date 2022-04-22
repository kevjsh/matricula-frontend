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
import { CicleService } from '../../services/cicle.service';

// Interfaces
import { Cicle } from '../../interfaces/cicle.interface';

export interface DialogData {
    cicle?: Cicle;
}

@Component({
    selector: 'app-save-cicle',
    templateUrl: './save-cicle.component.html',
    styleUrls: ['./save-cicle.component.css'],
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
      ],
})
export class SaveCicleComponent implements OnInit {
    cicle?: Cicle;

    year = new FormControl('', [Validators.required]);
    cicleNumber = new FormControl('', [Validators.required]);
    initDate = new FormControl('', [Validators.required]);
    finishDate = new FormControl('', [Validators.required]);

    constructor(
        private cicleService: CicleService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<SaveCicleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ){
        this.cicle = this.data.cicle;
    }

    ngOnInit(): void {
        if(this.cicle){
            this.year.setValue(this.cicle.year);
            this.cicleNumber.setValue(this.cicle.cicleNumber);
            if(this.cicle.initDate){
                this.initDate.setValue(moment(new Date(this.cicle.initDate?.toString() || ""), "YYYY-MM-DD"));
            }
            if(this.cicle.finishDate){
                this.finishDate.setValue(moment(new Date(this.cicle.finishDate?.toString() || ""), "YYYY-MM-DD"));
            }
        }
    }

    saveCicle(){
        const formStatus = this.year.hasError('required') || this.cicleNumber.hasError('required')
        || this.initDate.hasError('required') || this.finishDate.hasError('required');

        if(formStatus){
            return this.message('Por favor ingrese la información solicitada.')
        }

        let cicle: Cicle = {
            id: this.cicle?.id || 0,
            year: this.year.value,
            cicleNumber: this.cicleNumber.value,
            initDate: this.initDate.value.format('YYYY-MM-DD'),
            finishDate: this.finishDate.value.format('YYYY-MM-DD'),
        };

        this.cicleService.saveCicle(cicle);
        this.dialogRef.close();
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
            panelClass: ['snackbar']
        });
    }
}