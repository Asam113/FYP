import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats = {
    activeBookings: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    newNotifications: 0
  };

  activeTab: 'overview' | 'bookings' = 'overview';
  recentBookings: any[] = [];
  allBookings: any[] = [];
  upcomingTrips: any[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.roleSpecificId) {
      this.loadBookings(user.roleSpecificId);
    }
  }

  loadBookings(touristId: number): void {
    this.bookingService.getTouristBookings(touristId).subscribe({
      next: (bookings) => {
        this.allBookings = bookings.map(b => ({
          id: b.bookingId,
          tourId: b.tourId,
          tourName: b.tour.title,
          location: b.tour.destination,
          date: new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          startDate: new Date(b.tour.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          persons: b.numberOfPeople,
          totalAmount: b.totalAmount,
          status: b.status,
          tour: b.tour
        }));

        this.recentBookings = this.allBookings.slice(0, 5);

        // Filter for upcoming trips
        this.upcomingTrips = bookings
          .filter(b => b.status === 'Confirmed')
          .slice(0, 3)
          .map(b => ({
            name: b.tour.title,
            location: b.tour.destination,
            date: new Date(b.tour.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            duration: `${b.tour.durationDays} Days`
          }));

        // Calculate stats
        this.stats.activeBookings = bookings.filter(b => b.status === 'Confirmed').length;
        this.stats.upcomingTrips = this.upcomingTrips.length;
        this.stats.completedTrips = bookings.filter(b => b.status === 'Completed').length;
        this.stats.newNotifications = 0;
      },
      error: (err) => {
        console.error('Error loading tourist bookings:', err);
      }
    });
  }

  setTab(tab: 'overview' | 'bookings'): void {
    this.activeTab = tab;
  }

  viewDetails(tourId: number) {
    console.log('View details for tour:', tourId);
  }
}
