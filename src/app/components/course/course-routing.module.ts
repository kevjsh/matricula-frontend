import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CourseComponent } from './course.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'courses',
        component: CourseComponent
      },
      {
        path: '**',
        component: CourseComponent
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
export class CourseRoutingModule { }