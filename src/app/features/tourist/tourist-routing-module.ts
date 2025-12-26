import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Explore } from './explore/explore';
import { SubmitPlan } from './submit-plan/submit-plan';
import { FinalizedTours } from './finalized-tours/finalized-tours';
import { Payments } from './payments/payments';
import { Profile } from './profile/profile';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },
  { path: 'explore', component: Explore },
  { path: 'tour-details/:id', loadComponent: () => import('./tour-details/tour-details').then(m => m.TourDetailsComponent) },
  { path: 'submit-plan', component: SubmitPlan },
  { path: 'finalized-tours', component: FinalizedTours },
  { path: 'payments', component: Payments },
  { path: 'profile', component: Profile }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TouristRoutingModule { }
