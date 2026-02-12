import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DettaglioDipendenteComponent } from './components/dettaglio-dipendente/dettaglio-dipendente.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dipendente/:id', component: DettaglioDipendenteComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'about', component: AboutComponent}
  
];
