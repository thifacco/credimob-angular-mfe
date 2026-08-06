import { Routes } from '@angular/router';

export const PROPOSTA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../proposta-shell/proposta-shell').then(m => m.PropostaShell),
  },
];
