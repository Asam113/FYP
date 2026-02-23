import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../../core/services/driver.service';
import { AuthService } from '../../../core/services/auth.service';

interface Review {
  ratingId: number;
  tourName: string;
  touristName: string;
  date: string;
  overallStars: number;
  vehicleStars: number;
  comfortStars: number;
  behaviourStars: number;
  comment: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  activeTab: 'overview' | 'ratings' = 'overview';
  driverId: number = 0;

  // Rating Data
  averageOverall: number = 0;
  averageVehicle: number = 0;
  averageComfort: number = 0;
  averageBehaviour: number = 0;
  totalReviews: number = 0;
  reviews: Review[] = [];
  isLoadingRatings: boolean = false;

  constructor(
    private driverService: DriverService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.id) { // Fix: use user.id instead of userId
      this.driverId = user.id;
      this.fetchRatings();
    }
  }

  setTab(tab: 'overview' | 'ratings') {
    this.activeTab = tab;
  }

  fetchRatings() {
    this.isLoadingRatings = true;
    this.driverService.getDriverRatings(this.driverId).subscribe({
      next: (data: any) => {
        this.averageOverall = data.averageOverall;
        this.averageVehicle = data.averageVehicle;
        this.averageComfort = data.averageComfort;
        this.averageBehaviour = data.averageBehaviour;
        this.totalReviews = data.totalReviews;
        this.reviews = data.reviews;
        this.isLoadingRatings = false;
      },
      error: (err: any) => {
        console.error('Failed to load driver ratings', err);
        this.isLoadingRatings = false;
      }
    });
  }

  // Helper method for star arrays
  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((x, i) => i + 1);
  }
}
