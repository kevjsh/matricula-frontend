import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Services
import { CourseService } from '../../services/course.service';

// Interfaces
import { Career } from '../../interfaces/careers.interface';
import { Course } from '../../interfaces/course.interface';

export interface DialogData {
  careers: Career[];
  course?: Course;
}

@Component({
  selector: 'app-save-course',
  templateUrl: './save-course.component.html',
  styleUrls: ['./save-course.component.css'],
})
export class SaveCourseComponent implements OnInit {
  careers: Career[];
  course?: Course;

  foundCareers: Career[] = [];

  code = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  credits = new FormControl('', [Validators.required]);
  hours = new FormControl('', [Validators.required]);
  careerName = new FormControl('', [Validators.required]);

  selectedCareer?: Career;

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SaveCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.careers = this.data.careers;
    this.course = this.data.course;
  }


  ngOnInit(): void {
    if (this.course) {
      this.code.setValue(this.course.code);
      this.name.setValue(this.course.name);
      this.credits.setValue(this.course.credits);
      this.hours.setValue(this.course.hours);
      this.careerName.setValue({name: this.getCareer(this.course.careerId || 0), id:1});
    }
  }

  saveCourse() {

    const formStatus = this.code.hasError('required') || this.name.hasError('required') 
    || this.credits.hasError('required') || this.hours.hasError('required') || this.careerName.hasError('required');

    if(formStatus) {
      return this.message('Por favor ingrese la información solicitada.');
    }

    let course: Course = {
      id: this.course?.id || 0,
      code: this.code.value,
      name: this.name.value,
      credits: this.credits.value,
      hours: this.hours.value,
      careerId: this.selectedCareer?.id || this.course?.careerId,
    };

    this.courseService.saveCourse(course);
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
