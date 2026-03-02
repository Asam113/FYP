import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
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
  isPayingId: number | null = null;

  // Review Modal State
  selectedTourId: number | null = null;
  showReviewModal: boolean = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private toastService: ToastService
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
        this.bookings = data
          .filter(b => {
            const s = b.status?.toLowerCase();
            const ts = b.tour?.status?.toLowerCase();
            return s !== 'completed' && s !== 'cancelled' && ts !== 'completed' && ts !== 'cancelled';
          })
          .map(b => ({
            id: b.bookingId,
            tourId: b.tourId,
            title: b.tour?.title || 'Unknown Tour',
            location: b.tour?.destination || 'N/A',
            status: b.status,
            bookingDate: new Date(b.bookingDate).toLocaleDateString(),
            startDate: b.tour?.startDate ? new Date(b.tour.startDate).toLocaleDateString() : 'TBA',
            endDate: b.tour?.endDate ? new Date(b.tour.endDate).toLocaleDateString() : 'TBA',
            duration: b.tour ? `${b.tour.durationDays} Days` : 'N/A',
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

  submitReview(bookingId: number) {
    this.toastService.show('Thank you for your review!', 'success');
  }

  payNow(bookingId: number): void {
    this.isPayingId = bookingId;
    this.bookingService.createCheckoutSession(bookingId).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: (err) => {
        console.error('Checkout error:', err);
        this.toastService.show('Failed to initiate payment. Please try again.', 'error');
        this.isPayingId = null;
      }
    });
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
