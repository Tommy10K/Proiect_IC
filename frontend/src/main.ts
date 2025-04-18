import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // <-- Import appConfig instead

bootstrapApplication(AppComponent, appConfig) // <-- Use appConfig directly
  .catch(err => console.error(err));