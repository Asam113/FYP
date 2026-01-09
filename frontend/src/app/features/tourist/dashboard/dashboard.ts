import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  stats = {
    activeBookings: 3,
    upcomingTrips: 5,
    completedTrips: 12,
    newNotifications: 2
  };

  recentBookings = [
    {
      tourName: 'Northern Paradise Tour',
      location: 'Hunza Valley',
      date: '15 Jan 2026',
      persons: 2,
      status: 'Confirmed'
    },
    {
      tourName: 'Cultural Heritage Experience',
      location: 'Lahore & Multan',
      date: '22 Jan 2026',
      persons: 4,
      status: 'Pending'
    },
    {
      tourName: 'Mountain Adventure Trek',
      location: 'Skardu & K2 Base Camp',
      date: '5 Feb 2026',
      persons: 3,
      status: 'Confirmed'
    }
  ];

  upcomingTrips = [
    {
      name: 'Desert Safari Experience',
      location: 'Cholistan Desert',
      date: '10 Jan 2026',
      duration: '3 Days'
    },
    {
      name: 'Coastal Getaway',
      location: 'Gwadar & Kund Malir',
      date: '18 Jan 2026',
      duration: '5 Days'
    }
  ];

  viewDetails(tourId: number) {
    console.log('View details for tour:', tourId);
  }
}
