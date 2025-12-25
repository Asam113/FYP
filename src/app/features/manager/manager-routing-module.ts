import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Requests } from './requests/requests';
import { OfferServices } from './offer-services/offer-services';
import { Earnings } from './earnings/earnings';
import { Profile } from './profile/profile';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },
  { path: 'requests', component: Requests },
  { path: 'offer-services', component: OfferServices },
  { path: 'earnings', component: Earnings },
  { path: 'profile', component: Profile }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
