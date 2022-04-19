import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: '**',
        component: UserComponent
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
export class UserRoutingModule { }