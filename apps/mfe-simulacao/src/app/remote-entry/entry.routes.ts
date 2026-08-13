import { Routes } from '@angular/router';

export const SIMULACAO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../imoveis-list/imoveis-list').then(m => m.ImoveisList),
  },
  {
    path: ':id',
    loadComponent: () => import('../simulacao-form/simulacao-form').then(m => m.SimulacaoForm),
  },
];
