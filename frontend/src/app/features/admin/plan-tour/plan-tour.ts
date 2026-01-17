import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-plan-tour',
    imports: [CommonModule, FormsModule],
    templateUrl: './plan-tour.html',
    styleUrl: './plan-tour.css'
})
export class PlanTour {

    tourName: string = '';
    destination: string = '';
    departureLocation: string = '';
    startDate: string = '';
    endDate: string = '';
    maxParticipants: number | null = null;
    tourType: string = '';
    description: string = '';

    currentStep: number = 1;

    itinerary: { day: number, title: string, activities: string }[] = [
        { day: 1, title: '', activities: '' }
    ];

    // Pricing Fields
    basePrice: number | null = null;
    coupleDiscount: number | null = null;
    bulkDiscount: number | null = null;
    deposit: number | null = null;
    currency: string = 'PKR';

    constructor(private router: Router, private http: HttpClient) { }

    saveAsDraft() {
        console.log('Saved as draft');
        // Implement draft saving logic
    }

    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    addDay() {
        const nextDay = this.itinerary.length + 1;
        this.itinerary.push({ day: nextDay, title: '', activities: '' });
    }

    createTourPlan() {
        console.log('Creating Tour Plan...');

        const tourData = {
            Title: this.tourName,
            Destination: this.destination,
            DepartureLocation: this.departureLocation,
            StartDate: this.startDate,
            EndDate: this.endDate,
            DurationDays: this.calculateDuration(),
            MaxCapacity: this.maxParticipants || 0,
            PricePerHead: this.basePrice || 0,
            CoupleDiscountPercentage: this.coupleDiscount,
            BulkDiscountPercentage: this.bulkDiscount,
            BulkBookingMinPersons: 3, // Default suggestion
            Description: this.description,
            Status: 1 // Draft or Published? Assuming 0=Draft, 1=Published? Enum is Draft=0. Let's send Draft first.
        };

        this.http.post('http://localhost:5238/api/tours', tourData).subscribe({
            next: (res) => {
                console.log('Tour created successfully', res);
                this.router.navigate(['/admin/manage-tours']);
            },
            error: (err) => {
                console.error('Error creating tour', err);
                alert('Failed to create tour');
            }
        });
    }

    calculateDuration(): number {
        if (!this.startDate || !this.endDate) return 0;
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
}
