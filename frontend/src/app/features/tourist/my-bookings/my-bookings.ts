import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewModal } from '../../../shared/components/review-modal/review-modal';

interface DisplayBooking {
  id: number;
  tourId: number;
  title: string;
  location: string;
  status: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalCost: number;
  persons: number;
  tour: any;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewModal],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {

  bookings: DisplayBooking[] = [];
  isLoading: boolean = true;

  // Review Modal State
  selectedTourId: number | null = null;
  showReviewModal: boolean = false;

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
      next: (data) => {
        this.bookings = data.map(b => ({
          id: b.bookingId,
          tourId: b.tourId,
          title: b.tour.title,
          location: b.tour.destination,
          status: b.status,
          bookingDate: new Date(b.bookingDate).toLocaleDateString(),
          startDate: b.tour.startDate ? new Date(b.tour.startDate).toLocaleDateString() : 'TBA',
          endDate: b.tour.endDate ? new Date(b.tour.endDate).toLocaleDateString() : 'TBA',
          duration: `${b.tour.durationDays} Days`,
          totalCost: b.totalAmount,
          persons: b.numberOfPeople,
          tour: b.tour
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.isLoading = false;
      }
    });
  }

  openReviewModal(tourId: number) {
    this.selectedTourId = tourId;
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedTourId = null;
  }

  onReviewSubmitted() {
    alert('Thank you for your review!');
    // Optionally refresh bookings or mark this tour as reviewed locally to hide the button
  }

  get completedCount(): number {
    return this.bookings.filter(t => t.status === 'Completed').length;
  }

  get ongoingCount(): number {
    return this.bookings.filter(t => t.status === 'Confirmed').length;
  }

  get pendingCount(): number {
    return this.bookings.filter(t => t.status === 'Pending').length;
  }

  formatCurrency(value: number): string {
    return 'Rs. ' + value.toLocaleString();
  }
}
