import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests').then(m => m.Requests)
  },
  {
    path: 'offer-services',
    loadComponent: () => import('./offer-services/offer-services').then(m => m.OfferServices)
  },
  {
    path: 'earnings',
    loadComponent: () => import('./earnings/earnings').then(m => m.Earnings)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
