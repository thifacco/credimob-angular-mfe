import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'simulacao',
    loadChildren: () => loadRemoteModule('mfeSimulacao', './Routes').then(m => m.SIMULACAO_ROUTES),
  },
  {
    path: 'dados',
    loadChildren: () => loadRemoteModule('mfeForms', './Routes').then(m => m.FORMS_ROUTES),
  },
  {
    path: 'documentos',
    loadChildren: () => loadRemoteModule('mfeUploads', './Routes').then(m => m.UPLOADS_ROUTES),
  },
  {
    path: 'proposta',
    loadChildren: () => loadRemoteModule('mfeProposta', './Routes').then(m => m.PROPOSTA_ROUTES),
  },
  { path: '', redirectTo: 'simulacao', pathMatch: 'full' },
];
