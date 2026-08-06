import { Routes } from '@angular/router';

export const FORMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../forms-shell/forms-shell').then(m => m.FormsShell),
  },
];
