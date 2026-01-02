import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { PlanTour } from './plan-tour/plan-tour';
import { ManageTours } from './manage-tours/manage-tours';
import { FinalizedTours } from './finalized-tours/finalized-tours';
import { ManageDrivers } from './manage-drivers/manage-drivers';
import { ManageRestaurants } from './manage-restaurants/manage-restaurants';
import { Payments } from './payments/payments';
import { Reports } from './reports/reports';
import { Settings } from './settings/settings';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },
  { path: 'plan-tour', component: PlanTour },
  { path: 'manage-tours', component: ManageTours },
  { path: 'finalized-tours', component: FinalizedTours },
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
