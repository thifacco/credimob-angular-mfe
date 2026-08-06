import { Routes } from '@angular/router';

export const SIMULACAO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../simulacao-shell/simulacao-shell').then(m => m.SimulacaoShell),
  },
];
