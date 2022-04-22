import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { EnrollmentComponent } from './enrollment.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'enrollment',
        component: EnrollmentComponent
      },
      {
        path: '**',
        component: EnrollmentComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EnrollmentRoutingModule { }