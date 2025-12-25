import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ManageTours } from './manage-tours/manage-tours';
import { ManageDrivers } from './manage-drivers/manage-drivers';
import { ManageRestaurants } from './manage-restaurants/manage-restaurants';
import { Payments } from './payments/payments';
import { Reports } from './reports/reports';
import { Settings } from './settings/settings';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },
  { path: 'manage-tours', component: ManageTours },
  { path: 'manage-drivers', component: ManageDrivers },
  { path: 'manage-restaurants', component: ManageRestaurants },
  { path: 'payments', component: Payments },
  { path: 'reports', component: Reports },
  { path: 'settings', component: Settings }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
