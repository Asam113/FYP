import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-plan-tour',
    imports: [CommonModule, FormsModule],
    templateUrl: './plan-tour.html',
    styleUrl: './plan-tour.css'
})
export class PlanTour {

    tourName: string = '';
    destination: string = '';
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
    discount: number | null = null;
    deposit: number | null = null;
    currency: string = 'PKR';

    constructor(private router: Router) { }

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
        // Implement tour creation logic
        this.router.navigate(['/admin/manage-tours']);
    }
}
