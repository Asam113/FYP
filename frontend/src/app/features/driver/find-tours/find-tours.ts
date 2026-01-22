import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Tour {
    tourId: number;
    title: string;
    destination: string;
    departureLocation: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    pricePerHead: number;
    status: string;
    description?: string;
}

interface Vehicle {
    vehicleId: number;
    model: string;
    capacity: number;
}

@Component({
    selector: 'app-find-tours',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './find-tours.html',
    styleUrl: './find-tours.css'
})
export class FindTours implements OnInit {
    tours: Tour[] = [];
    filteredTours: Tour[] = [];
    isLoading = true;

    // Modal state
    showOfferModal = false;
    selectedTour: Tour | null = null;

    // Driver vehicles
    driverVehicles: Vehicle[] = [];

    // Offer form
    selectedVehicleId: number | null = null;
    quotedPrice: number | null = null;
    additionalNotes: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadTours();
        this.loadDriverVehicles();
    }

    loadTours() {
        this.http.get<Tour[]>('http://localhost:5238/api/tours').subscribe({
            next: (data) => {
                // Filter tours that are open for offers (not Finalized or Cancelled)
                this.tours = data.filter(t => t.status === 'Draft' || t.status === 'Open');
                this.filteredTours = this.tours;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading tours:', err);
                this.isLoading = false;
            }
        });
    }

    loadDriverVehicles() {
        // TODO: Get actual driver ID from auth service
        const driverId = 1; // Mock for now

        this.http.get<Vehicle[]>(`http://localhost:5238/api/drivers/${driverId}/vehicles`).subscribe({
            next: (data) => {
                this.driverVehicles = data;
            },
            error: (err) => {
                console.error('Error loading vehicles:', err);
                // Mock data for demo
                this.driverVehicles = [
                    { vehicleId: 1, model: 'Toyota Hiace 2020', capacity: 15 },
                    { vehicleId: 2, model: 'Coaster Bus 2019', capacity: 30 }
                ];
            }
        });
    }

    openOfferModal(tour: Tour) {
        this.selectedTour = tour;
        this.showOfferModal = true;
        this.resetOfferForm();
    }

    closeOfferModal() {
        this.showOfferModal = false;
        this.selectedTour = null;
        this.resetOfferForm();
    }

    resetOfferForm() {
        this.selectedVehicleId = null;
        this.quotedPrice = null;
        this.additionalNotes = '';
    }

    submitOffer() {
        if (!this.selectedTour || !this.selectedVehicleId || !this.quotedPrice) {
            alert('Please fill in all required fields');
            return;
        }

        const offerData = {
            tourId: this.selectedTour.tourId,
            vehicleId: this.selectedVehicleId,
            quotedPrice: this.quotedPrice,
            additionalNotes: this.additionalNotes || null
        };

        this.http.post('http://localhost:5238/api/offers/driver', offerData).subscribe({
            next: (response) => {
                console.log('Offer submitted:', response);
                alert(`Offer submitted successfully for "${this.selectedTour?.title}"!`);
                this.closeOfferModal();
            },
            error: (err) => {
                console.error('Error submitting offer:', err);
                alert('Failed to submit offer: ' + (err.error?.message || err.message));
            }
        });
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
