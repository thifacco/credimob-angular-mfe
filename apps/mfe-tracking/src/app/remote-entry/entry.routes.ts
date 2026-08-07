import { Routes } from '@angular/router';

export const TRACKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../tracking-shell/tracking-shell').then(m => m.TrackingShell),
  },
];
