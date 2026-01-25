import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Tour {
    tourId: number;
    title: string;
    destination: string;
    departureLocation: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    basePrice: number;
    serviceRequirements: ServiceRequirement[];
    driverOffers: DriverOffer[];
    status: number;
}

interface ServiceRequirement {
    requirementId: number;
    type: string;
    location: string;
    dateNeeded: string;
    restaurantOffers: RestaurantOffer[];
}

interface DriverOffer {
    offerId: number;
    transportationFare: number;
    routeDetails: string;
    includesFuel: boolean;
    status: string;
    driver: {
        user: {
            fullName: string;
        };
    };
    vehicle: {
        model: string;
    };
}

interface RestaurantOffer {
    offerId: number;
    pricePerPerson: number;
    status: string;
    restaurant: {
        user: {
            fullName: string;
        };
        restaurantName: string;
    };
}

interface DisplayTour {
    id: number;
    name: string;
    destination: string;
    duration: string;
    pricePerPerson: number;
    totalSeats: number;
    hasDriverOffer: boolean;
    hasRestaurantOffer: boolean;
    driverOffers: DriverOffer[];
    restaurantOffers: RestaurantOffer[];
    serviceRequirements: ServiceRequirement[];
}

@Component({
    selector: 'app-finalized-tours',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './finalized-tours.html',
    styleUrl: './finalized-tours.css'
})
export class FinalizedTours implements OnInit {

    tours: DisplayTour[] = [];
    loading = true;
    error = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadTours();
    }

    loadTours(): void {
        this.http.get<Tour[]>('http://localhost:5238/api/tours')
            .subscribe({
                next: (tours) => {
                    // Filter to show only finalized tours
                    this.tours = tours
                        .filter(tour => tour.status === 2) // 2 = Finalized in TourStatus enum
                        .map(tour => {
                            const allRestaurantOffers = tour.serviceRequirements
                                .flatMap(req => req.restaurantOffers || []);

                            return {
                                id: tour.tourId,
                                name: tour.title,
                                destination: tour.destination,
                                duration: `${new Date(tour.startDate).toLocaleDateString()} - ${new Date(tour.endDate).toLocaleDateString()}`,
                                pricePerPerson: tour.basePrice,
                                totalSeats: tour.maxCapacity,
                                hasDriverOffer: (tour.driverOffers?.length || 0) > 0,
                                hasRestaurantOffer: allRestaurantOffers.length > 0,
                                driverOffers: tour.driverOffers || [],
                                restaurantOffers: allRestaurantOffers,
                                serviceRequirements: tour.serviceRequirements || []
                            };
                        });
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading tours:', err);
                    this.error = 'Failed to load tours';
                    this.loading = false;
                }
            });
    }

    getOfferStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}
