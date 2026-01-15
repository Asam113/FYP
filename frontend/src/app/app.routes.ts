import { Routes } from '@angular/router';
import { Error404 } from './features/common-feature/error404/error404';
import { Home } from './features/common-feature/home/home';
import { MainLayout } from './features/common-feature/main-layout/main-layout';
import { Login } from './features/common-feature/login/login';
import { RoleSelection } from './features/common-feature/role-selection/role-selection';
import { TouristSignup } from './features/common-feature/tourist-signup/tourist-signup';
import { DriverSignup } from './features/common-feature/driver-signup/driver-signup';
import { RestaurantSignup } from './features/common-feature/restaurant-signup/restaurant-signup';
import { VerifyOtp } from './features/common-feature/verify-otp/verify-otp';
import { OtpVerification } from './features/common-feature/otp-verification/otp-verification';
import { TouristLayout } from './features/tourist/layout/tourist-layout';
import { DriverLayout } from './features/driver/layout/driver-layout';
import { RestaurantLayout } from './features/restaurant/layout/restaurant-layout';
import { AdminLayout } from './features/admin/layout/admin-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'role-selection', component: RoleSelection },
  { path: 'tourist-signup', component: TouristSignup },
  { path: 'driver-signup', component: DriverSignup },
  { path: 'restaurant-signup', component: RestaurantSignup },
  { path: 'verify-otp', component: VerifyOtp },

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
    path: 'restaurant',
    component: RestaurantLayout,
    loadChildren: () =>
      import('./features/restaurant/restaurant-module').then(m => m.RestaurantModule),
  },
  {
    path: 'admin',
    component: AdminLayout,
    loadChildren: () =>
      import('./features/admin/admin-module').then(m => m.AdminModule),
  },

  { path: '**', component: Error404 },
];
