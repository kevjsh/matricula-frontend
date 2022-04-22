import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { GroupComponent } from './group.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'group',
        component: GroupComponent
      },
      {
        path: '**',
        component: GroupComponent
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
export class GroupRoutingModule { }