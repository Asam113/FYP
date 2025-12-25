import { Routes } from '@angular/router';
import { Error404 } from './features/common-feature/error404/error404';
import { Home } from './features/common-feature/home/home';
import { MainLayout } from './features/common-feature/main-layout/main-layout';
import { Login } from './features/common-feature/login/login';
import { Signup } from './features/common-feature/signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },

      {
        path: 'tourist',
        loadChildren: () =>
          import('./features/tourist/tourist-module').then(m => m.TouristModule),
      },
      {
        path: 'driver',
        loadChildren: () =>
          import('./features/driver/driver-module').then(m => m.DriverModule),
      },
      {
        path: 'manager',
        loadChildren: () =>
          import('./features/manager/manager-module').then(m => m.ManagerModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin-module').then(m => m.AdminModule),
      },
    ],
  },

  { path: '**', component: Error404 },
];
