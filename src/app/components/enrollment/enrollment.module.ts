import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// Modules
import { EnrollmentRoutingModule } from './enrollment-routing.module';

// Components
import { EnrollmentComponent } from './enrollment.component';


@NgModule({
  declarations: [
    EnrollmentComponent
  ],
  imports: [
    CommonModule,
    EnrollmentRoutingModule
  ]
})
export class EnrollmentModule { }
