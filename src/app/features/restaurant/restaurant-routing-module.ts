import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'explore-tours',
    loadComponent: () => import('./explore-tours/explore-tours').then(m => m.ExploreTours)
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests').then(m => m.Requests)
  },
  {
    path: 'orders',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) // Placeholder
  },
  {
    path: 'offer-services',
    loadComponent: () => import('./offer-services/offer-services').then(m => m.OfferServices)
  },
  {
    path: 'earnings', // Kept for backward compatibility if needed, though removed from sidebar
    loadComponent: () => import('./earnings/earnings').then(m => m.Earnings)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  },
  {
    path: 'settings',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) // Placeholder
  },
  {
    path: 'notifications',
    loadComponent: () => import('../../shared/components/notifications/notifications.component').then(m => m.SharedNotificationsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
