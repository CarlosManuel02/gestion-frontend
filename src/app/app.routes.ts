import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule)
  },
  {
    path: '**',
    redirectTo: 'main'
  }
];
