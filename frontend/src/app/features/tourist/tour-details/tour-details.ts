import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Tour } from '../../../core/models/tour.interface';
import { TourService } from '../../../core/services/tour.service';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tour-details',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './tour-details.html',
    styleUrls: ['./tour-details.css']
})
export class TourDetailsComponent implements OnInit {

    tour: Tour | undefined;
    isLoading: boolean = true;
    seatsRemaining: number = 0;

    // Booking Fields
    selectedBookingType: string = 'Individual';
    numberOfPeople: number = 1;
    totalPrice: number = 0;
    minPeople: number = 1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tourService: TourService,
        private bookingService: BookingService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.tourService.getTourById(id).subscribe({
                next: (data) => {
                    this.tour = data;
                    if (this.tour) {
                        this.seatsRemaining = (this.tour.totalSeats || 0) - (this.tour.seatsBooked || 0);
                        this.updatePrice();
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error("Error fetching tour", err);
                    this.isLoading = false;
                }
            });
        } else {
            this.isLoading = false;
        }
    }

    updatePrice() {
        if (!this.tour) return;

        let price = this.tour.pricePerHead || 0;
        let discount = 0;

        if (this.selectedBookingType === 'Couple') {
            this.numberOfPeople = 2;
            this.minPeople = 2;
            if (this.tour.coupleDiscountPercentage) {
                discount = (price * 2) * (this.tour.coupleDiscountPercentage / 100);
            }
        } else if (this.selectedBookingType === 'Bulk') {
            this.minPeople = this.tour.bulkBookingMinPersons || 3;
            if (this.numberOfPeople < this.minPeople) this.numberOfPeople = this.minPeople;

            if (this.tour.bulkDiscountPercentage) {
                discount = (price * this.numberOfPeople) * (this.tour.bulkDiscountPercentage / 100);
            }
        } else {
            this.minPeople = 1;
            discount = 0;
        }

        this.totalPrice = (price * this.numberOfPeople) - discount;
    }

    bookTour() {
        if (!this.tour) return;

        const bookingRequest = {
            TourId: this.tour.id, // Assuming id maps to TourId
            TouristId: 1, // TODO: Get from AuthService
            NumberOfPeople: this.numberOfPeople,
            TotalAmount: this.totalPrice,
            BookingType: this.selectedBookingType === 'Individual' ? 0 : this.selectedBookingType === 'Couple' ? 1 : 2
        };

        this.bookingService.createBooking(bookingRequest).subscribe({
            next: (res) => {
                this.toastService.show('Booking Successful!', 'success');
                this.router.navigate(['/tourist/dashboard']);
            },
            error: (err) => {
                console.error('Booking failed', err);
                this.toastService.show('Booking Failed: ' + (err.error || err.message), 'error');
            }
        });
    }

}
