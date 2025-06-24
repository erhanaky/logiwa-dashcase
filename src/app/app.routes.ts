import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashcase',
    loadComponent: () =>
      import('./dashcase/dashcase.component').then((m) => m.DashcaseComponent),
  },
  { path: '', redirectTo: 'dashcase', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashcase' },
];
