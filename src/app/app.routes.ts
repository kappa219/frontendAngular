import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DettaglioDipendenteComponent } from './features/dettaglio-dipendente/dettaglio-dipendente.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './features/about/about.component';
import { ContattaciComponent } from './features/contattaci/contattaci.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dipendente/:id', component: DettaglioDipendenteComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'about', component: AboutComponent, canActivate: [authGuard]},
  {path: 'contattaci', component: ContattaciComponent, canActivate: [authGuard]},
  
];
