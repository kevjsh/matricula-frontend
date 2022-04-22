import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { GradesComponent } from './grades.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'grades',
        component: GradesComponent
      },
      {
        path: '**',
        component: GradesComponent
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
export class GradesRoutingModule { }