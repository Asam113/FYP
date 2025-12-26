import { Routes } from '@angular/router';
import { Error404 } from './features/common-feature/error404/error404';
import { Home } from './features/common-feature/home/home';
import { MainLayout } from './features/common-feature/main-layout/main-layout';
import { Login } from './features/common-feature/login/login';
import { Signup } from './features/common-feature/signup/signup';
import { TouristLayout } from './features/tourist/layout/tourist-layout';
import { DriverLayout } from './features/driver/layout/driver-layout';
import { ManagerLayout } from './features/manager/layout/manager-layout';
import { AdminLayout } from './features/admin/layout/admin-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },
    ]
  },
  {
    path: 'tourist',
    component: TouristLayout,
    loadChildren: () =>
      import('./features/tourist/tourist-module').then(m => m.TouristModule),
  },
  {
    path: 'driver',
    component: DriverLayout,
    loadChildren: () =>
      import('./features/driver/driver-module').then(m => m.DriverModule),
  },
  {
    path: 'manager',
    component: ManagerLayout,
    loadChildren: () =>
      import('./features/manager/manager-module').then(m => m.ManagerModule),
  },
  {
    path: 'admin',
    component: AdminLayout,
    loadChildren: () =>
      import('./features/admin/admin-module').then(m => m.AdminModule),
  },

  { path: '**', component: Error404 },
];
