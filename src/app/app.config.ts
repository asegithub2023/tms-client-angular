import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    // Coalesce browser events while keeping router and HTTP setup centralized.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      // Interceptors apply credentials, error handling, and bearer authentication globally.
      withInterceptors([
        credentialsInterceptor,
        errorInterceptor,
        jwtInterceptor
      ]),
      withXsrfConfiguration({
        // Match the API's cookie-to-header CSRF contract.
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    provideAnimations()
  ]
};