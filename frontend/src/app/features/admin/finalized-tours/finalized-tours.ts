import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Tour {
    tourId: number;
    title: string;
    destination: string;
    departureLocation: string;
    description?: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    currentBookings: number;
    pricePerHead: number;
    serviceRequirements: ServiceRequirement[];
    driverOffers: DriverOffer[];
    status: string;
    bookings?: Booking[];
}

interface Booking {
    bookingId: number;
    touristName?: string; // We'll map this from tourist.user.name
    tourist?: {
        user: {
            name: string;
        };
    };
    numberOfPeople: number;
    totalAmount: number;
    status: string;
    bookingDate: string;
}

interface ServiceRequirement {
    requirementId: number;
    type: string;
    location: string;
    dateNeeded: string;
    time?: string;
    stayDurationDays?: number;
    estimatedPeople: number;
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
        capacity: number;
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
    // Accommodation fields
    rentPerNight?: number;
    totalRooms?: number;
    totalRent?: number;
    stayDurationDays?: number;
}

interface DisplayTour {
    id: number;
    name: string;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    duration: string;
    pricePerPerson: number;
    totalSeats: number;
    bookedSeats: number;
    hasDriverOffer: boolean;
    hasRestaurantOffer: boolean;
    driverOffers: DriverOffer[];
    restaurantOffers: RestaurantOffer[];
    serviceRequirements: ServiceRequirement[];
    bookings: Booking[];
    status: string;
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
    selectedTour: DisplayTour | null = null;
    activeTab: 'basic' | 'requirements' | 'offers' | 'bookings' = 'basic';

    loading = true;
    error = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadTours();
    }

    loadTours(): void {
        this.http.get<Tour[]>(`${environment.apiUrl}/api/tours`)
            .subscribe({
                next: (tours) => {
                    // Filter to show Finalized and Ready tours
                    this.tours = tours
                        .filter(tour => tour.status === 'Finalized' || tour.status === 'Ready')
                        .map(tour => {
                            const allRestaurantOffers = tour.serviceRequirements
                                .flatMap(req => req.restaurantOffers || []);

                            const bookings = (tour.bookings || []).map(b => ({
                                ...b,
                                touristName: b.tourist?.user?.name || 'Unknown Tourist'
                            }));

                            return {
                                id: tour.tourId,
                                name: tour.title,
                                destination: tour.destination,
                                description: tour.description || 'No description available',
                                startDate: new Date(tour.startDate),
                                endDate: new Date(tour.endDate),
                                duration: this.calculateDuration(tour.startDate, tour.endDate),
                                pricePerPerson: tour.pricePerHead,
                                totalSeats: tour.maxCapacity,
                                bookedSeats: tour.currentBookings,
                                hasDriverOffer: (tour.driverOffers?.length || 0) > 0,
                                hasRestaurantOffer: allRestaurantOffers.length > 0,
                                driverOffers: tour.driverOffers || [],
                                restaurantOffers: allRestaurantOffers,
                                serviceRequirements: tour.serviceRequirements || [],
                                bookings: bookings,
                                status: tour.status
                            };
                        });

                    // Automatically select the first tour if available
                    if (this.tours.length > 0) {
                        this.selectTour(this.tours[0]);
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading tours:', err);
                    this.error = 'Failed to load tours';
                    this.loading = false;
                }
            });
    }

    selectTour(tour: DisplayTour): void {
        this.selectedTour = tour;
        this.activeTab = 'basic'; // Reset tab when switching tours
    }

    setActiveTab(tab: 'basic' | 'requirements' | 'offers' | 'bookings'): void {
        this.activeTab = tab;
    }

    calculateDuration(start: string, end: string): string {
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = Math.abs(e.getTime() - s.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} Days`;
    }

    getOfferStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Helper to format time for UI (reused logic)
    formatTime(time?: string): string {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m < 10 ? '0' + m : m} ${ampm}`;
    }

    markTourAsReady(tourId: number): void {
        if (!confirm('Are you sure you want to mark this tour as Ready? This indicates all bookings are confirmed and the tour is prepared for departure.')) {
            return;
        }

        this.http.post(`${environment.apiUrl}/api/tours/${tourId}/mark-ready`, {})
            .subscribe({
                next: () => {
                    alert('Tour marked as Ready successfully');
                    this.loadTours();
                },
                error: (err) => {
                    console.error('Error marking tour as ready:', err);
                    alert('Failed to mark tour as ready');
                }
            });
    }

    currentFilter: 'All' | 'Finalized' | 'Ready' = 'All';

    get filteredTours(): DisplayTour[] {
        if (this.currentFilter === 'All') return this.tours;
        return this.tours.filter(t => t.status === this.currentFilter);
    }

    setFilter(filter: 'All' | 'Finalized' | 'Ready'): void {
        this.currentFilter = filter;
    }
}
