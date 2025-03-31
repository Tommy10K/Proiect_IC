import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'login', component: LoginComponent },
];

export const appProviders = [
  importProvidersFrom(FormsModule),
  provideRouter(routes),
  provideHttpClient(),
];