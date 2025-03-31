import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // Ensure importProvidersFrom is imported
import { provideRouter, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule), // Use importProvidersFrom for FormsModule
  ],
};