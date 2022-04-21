import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Services
import { CareerService } from '../../services/career.service';

// Interfaces
import { Career } from '../../interfaces/careers.interface';

export interface DialogData {
    career?: Career;
}

@Component({
    selector: 'app-save-career',
    templateUrl: './save-career.component.html',
    styleUrls: ['./save-career.component.css'],
})
export class SaveCareerComponent implements OnInit {
    career?: Career;

    code = new FormControl('', [Validators.required]);
    name = new FormControl('', [Validators.required]);
    title = new FormControl('', [Validators.required]);

    constructor(
        private careerService: CareerService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<SaveCareerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.career = this.data.career;
    }

    ngOnInit(): void {
        if (this.career) {
            this.code.setValue(this.career.code);
            this.name.setValue(this.career.name);
            this.title.setValue(this.career.title);
        }
    }

    addCareer() {
        const formStatus = this.code.hasError('required') || this.name.hasError('required')
            || this.title.hasError('required');

        if (formStatus) {
            return this.message('Por favr ingrese la información solicitada.')
        }

        let career: Career = {
            id: this.career?.id || 0,
            code: this.code.value,
            name: this.name.value,
            title: this.title.value,
        };

        this.careerService.saveCareer(career);
        this.dialogRef.close();
        this.message('Actualización correcta');
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
