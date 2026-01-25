import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
    ServiceRequest,
    ServiceType,
    ServiceRequestStatus
} from '../../../core/models/service-request';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-plan-tour',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './plan-tour.html',
    styleUrl: './plan-tour.css'
})
export class PlanTour {

    /* =======================
       STEP CONTROL (UI)
    ======================== */
    currentStep: number = 1; // 1=Details, 2=Pricing, 3=Requirements

    nextStep(): void {
        if (this.currentStep < 3) {
            this.currentStep++;
        }
    }

    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    /* =======================
       TOUR DETAILS
    ======================== */
    tourName = '';
    destination = '';
    departureLocation = '';
    startDate = '';
    endDate = '';
    maxParticipants: number | null = null;
    tourType = '';
    description = '';

    /* =======================
       PRICING
    ======================== */
    basePrice: number | null = null;
    coupleDiscount: number | null = null;
    bulkDiscount: number | null = null;

    /* =======================
       SERVICE REQUIREMENTS
    ======================== */
    featureRequirements: ServiceRequest[] = [];

    newReqType: ServiceType = ServiceType.Meal;
    newReqLocation = '';
    newReqDate = '';
    newReqTime = '';
    newReqDuration = 1;

    constructor(
        private router: Router,
        private http: HttpClient,
        private toastService: ToastService
    ) { }

    /* =======================
       ACTIONS
    ======================== */
    saveAsDraft(): void {
        console.log('Tour saved as draft');
    }

    addRequirement(): void {
        if (!this.newReqLocation || !this.newReqDate) {
            this.toastService.show('Please fill in Location and Date', 'warning');
            return;
        }

        const request: ServiceRequest = {
            serviceType: this.newReqType,
            location: this.newReqLocation,
            dateNeeded: this.newReqDate,
            time: this.newReqType === ServiceType.Meal ? this.newReqTime : undefined,
            stayDurationDays:
                this.newReqType === ServiceType.Accommodation
                    ? this.newReqDuration
                    : undefined,
            status: ServiceRequestStatus.Open
        };

        this.featureRequirements.push(request);
        this.resetRequirementForm();
    }

    removeRequirement(index: number): void {
        this.featureRequirements.splice(index, 1);
    }

    createTourPlan(): void {

        if (
            !this.tourName ||
            !this.destination ||
            !this.departureLocation ||
            !this.startDate ||
            !this.endDate ||
            !this.maxParticipants ||
            !this.basePrice
        ) {
            this.toastService.show('Please fill in all required tour and pricing details', 'warning');
            return;
        }

        const createTourDto = {
            title: this.tourName,
            description: this.description,
            departureLocation: this.departureLocation,
            destination: this.destination,
            startDate: this.startDate,
            endDate: this.endDate,
            maxCapacity: this.maxParticipants,
            pricePerHead: this.basePrice,
            coupleDiscountPercentage: this.coupleDiscount ?? 0,
            bulkDiscountPercentage: this.bulkDiscount ?? 0,
            bulkBookingMinPersons: 10,
            serviceRequirements: this.featureRequirements.map(req => ({
                type: req.serviceType,
                location: req.location,
                dateNeeded: req.dateNeeded,
                time: req.time,
                stayDurationDays: req.stayDurationDays,
                estimatedPeople: this.maxParticipants,
                estimatedBudget: null
            }))
        };

        this.http.post<any>('http://localhost:5238/api/tours', createTourDto)
            .subscribe({
                next: () => {
                    this.toastService.show('Tour created successfully', 'success');
                    this.router.navigate(['/admin/manage-tours']);
                },
                error: (err) => {
                    console.error(err);
                    this.toastService.show(err.error?.message || 'Failed to create tour', 'error');
                }
            });
    }

    /* =======================
       UTILITIES
    ======================== */
    resetRequirementForm(): void {
        this.newReqLocation = '';
        this.newReqDate = '';
        this.newReqTime = '';
        this.newReqDuration = 1;
    }

    getEndDate(startDate: string, nights: number): Date {
        const date = new Date(startDate);
        date.setDate(date.getDate() + nights);
        return date;
    }

    calculateDuration(): number {
        if (!this.startDate || !this.endDate) return 0;
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
}
