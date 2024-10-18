import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { foodRoutes } from './mainscreen/foods.routes';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login/login.guard';

export const routes: Routes = [
  { 
    path: 'signup', 
    component: SignupComponent,
    canActivate: [LoginGuard] // Optional: also protect signup with same guard
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  { 
    path: 'home', 
    component: MainscreenComponent,
    children: foodRoutes,
    canActivate: [AuthGuard],
  },
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
];