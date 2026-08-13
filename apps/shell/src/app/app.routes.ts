import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'simulacao',
    data: { breadcrumb: 'simulação' },
    loadChildren: () => loadRemoteModule('mfeSimulacao', './Routes').then(m => m.SIMULACAO_ROUTES),
  },
  {
    path: 'dados',
    data: { breadcrumb: 'dados' },
    loadChildren: () => loadRemoteModule('mfeForms', './Routes').then(m => m.FORMS_ROUTES),
  },
  {
    path: 'documentos',
    data: { breadcrumb: 'documentos' },
    loadChildren: () => loadRemoteModule('mfeUploads', './Routes').then(m => m.UPLOADS_ROUTES),
  },
  {
    path: 'proposta',
    data: { breadcrumb: 'proposta' },
    loadChildren: () => loadRemoteModule('mfeProposta', './Routes').then(m => m.PROPOSTA_ROUTES),
  },
  {
    path: 'acompanhamento',
    loadChildren: () => loadRemoteModule('mfeTracking', './Routes').then(m => m.TRACKING_ROUTES),
  },
  { path: '', redirectTo: 'acompanhamento', pathMatch: 'full' },
];
