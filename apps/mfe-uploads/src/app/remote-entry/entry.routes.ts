import { Routes } from '@angular/router';

export const UPLOADS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../uploads-shell/uploads-shell').then(m => m.UploadsShell),
  },
];
