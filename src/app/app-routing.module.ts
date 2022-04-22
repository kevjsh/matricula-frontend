import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './components/guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'main',
    component: MainPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/course/course.module').then( m => m.CourseModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./components/user/user.module').then( m => m.UserModule)
  },
  {
    path: 'careers',
    loadChildren: () => import('./components/career/career.module').then( m => m.CareerModule)
  },
  {
    path: 'cicles',
    loadChildren: () => import('./components/cicle/cicle.module').then( m => m.CicleModule )
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
