// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }         from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS }     from '@angular/common/http';

import { AppComponent }    from './app/app.component';
import { routes }       from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AuthService }     from './app/services/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // activează HTTPClient și injecția de interceptoare
    provideHttpClient(withInterceptorsFromDi()),
    // înregistrează interceptor-ul
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService  // asigură-te că AuthService e în DI
  ]
})
.catch(err => console.error(err));
