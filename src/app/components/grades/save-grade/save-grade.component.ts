import { Component, OnInit, Inject } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


// Services
import { EnrollmentService } from '../../services/enrollment.service';

// Interfaces
import { Enrollment } from '../../interfaces/enrollment.interface';

export interface DialogData {
  enrollment: Enrollment
}

@Component({
  selector: 'app-save-grade',
  templateUrl: './save-grade.component.html',
  styleUrls: ['./save-grade.component.css']
})
export class SaveGradeComponent implements OnInit {

  grade = new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]);
  enrollment!: Enrollment;


  constructor(
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SaveGradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.enrollment = this.data.enrollment;

  }

  ngOnInit(): void {

    if (this.enrollment) {
      this.grade.setValue(this.enrollment.grade);
    }
  }

  saveEnrollment() {

    const formStatus = this.grade.hasError('required') || this.grade.hasError('min') || this.grade.hasError('max');

    if (formStatus) {
      return this.message('Por favor ingrese la información solicitada.')
    }

    this.enrollment.grade = this.grade.value || this.enrollment?.grade || 0;

    this.enrollmentService.saveEnrollment(this.enrollment);
    this.dialogRef.close();
    this.message('Nota actualizada correctamente');
  }

  /* ******************************************************************************* */

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
