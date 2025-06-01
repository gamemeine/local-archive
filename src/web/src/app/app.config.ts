// /src/web/src/app/app.config.ts
// Angular application configuration: sets up routing, Auth0, and HTTP client.

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),           // Angular router with app routes
    provideAuth0({ ...env.auth }),   // Auth0 authentication provider
    provideHttpClient()              // Angular HTTP client
  ],
};