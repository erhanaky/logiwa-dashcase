import { Provider } from '@angular/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function provideApollo(): Provider[] {
  return [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        link: httpLink.create({ uri: 'http://localhost:4000/' }),
        cache: new InMemoryCache(),
      }),
      deps: [HttpLink],
    },
  ];
}
