import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { foodRoutes } from './mainscreen/foods.routes';
import { MainscreenComponent } from './mainscreen/mainscreen.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: MainscreenComponent,
    children: foodRoutes
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
