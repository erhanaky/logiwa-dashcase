import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideApollo(() => {
      const link = inject(HttpLink).create({
        uri: 'http://localhost:4000/',
      });
      return {
        link,
        cache: new InMemoryCache(),
      };
    }),
  ],
};
