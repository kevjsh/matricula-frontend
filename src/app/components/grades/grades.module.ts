import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// Modules
import { GradesRoutingModule } from './grades-routing.module';

// Components
import { GradesComponent } from './grades.component';


@NgModule({
  declarations: [
    GradesComponent
  ],
  imports: [
    CommonModule,
    GradesRoutingModule
  ]
})
export class GradesModule { }
