import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

interface Tour {
    tourId: number;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    mealRequirementsCount: number;
    accommodationRequirementsCount: number;
    requirements: ServiceRequirement[];
}

interface ServiceRequirement {
    requirementId: number;
    type: string; // "Meal" or "Accommodation"
    location: string;
    dateNeeded: string;
    time?: string;
    stayDurationDays?: number;
    details?: string;
    estimatedPeople: number;
    estimatedBudget?: number;
    status: string;
    tour?: {
        tourId: number;
        title: string;
        startDate: string;
        endDate: string;
        destination: string;
        durationDays: number;
    };
}

@Component({
    selector: 'app-tour-requests',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tour-requests.html',
    styleUrl: './tour-requests.css'
})
export class TourRequests implements OnInit {
    tours: Tour[] = [];
    isLoading = true;

    // View state
    showTourDetails = false;
    selectedTour: Tour | null = null;

    // Filters
    filterStatus: string = 'Open';

    // Modal state
    showOfferModal = false;
    selectedRequirement: ServiceRequirement | null = null;

    // Meal offer form
    pricePerHead: number | null = null;
    minimumPeople: number | null = null;
    maximumPeople: number | null = null;
    mealType: string = '';
    includesBeverages: boolean = false;
    offerDetails: string = '';

    // Accommodation offer form
    rentPerNight: number | null = null;
    perRoomCapacity: number | null = null;
    description: string = '';

    constructor(private http: HttpClient, private toastService: ToastService) { }

    ngOnInit() {
        this.loadTourRequirements();
    }

    loadTourRequirements() {
        const params = this.filterStatus !== 'All' ? `?status=${this.filterStatus}` : '';

        this.http.get<ServiceRequirement[]>(`${environment.apiUrl}/api/servicerequirements${params}`).subscribe({
            next: (data) => {
                this.groupRequirementsByTour(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading requirements:', err);
                this.isLoading = false;
            }
        });
    }

    groupRequirementsByTour(requirements: ServiceRequirement[]) {
        const tourMap = new Map<number, Tour>();

        requirements.forEach(req => {
            if (req.tour) {
                if (!tourMap.has(req.tour.tourId)) {
                    tourMap.set(req.tour.tourId, {
                        tourId: req.tour.tourId,
                        title: req.tour.title,
                        destination: req.tour.destination,
                        startDate: req.tour.startDate,
                        endDate: req.tour.endDate,
                        durationDays: req.tour.durationDays,
                        mealRequirementsCount: 0,
                        accommodationRequirementsCount: 0,
                        requirements: []
                    });
                }

                const tour = tourMap.get(req.tour.tourId)!;
                tour.requirements.push(req);

                if (req.type === 'Meal') {
                    tour.mealRequirementsCount++;
                } else if (req.type === 'Accommodation') {
                    tour.accommodationRequirementsCount++;
                }
            }
        });

        this.tours = Array.from(tourMap.values());
    }

    viewTourDetails(tour: Tour) {
        this.selectedTour = tour;
        this.showTourDetails = true;
    }

    backToTourList() {
        this.showTourDetails = false;
        this.selectedTour = null;
    }

    getMealRequirements(): ServiceRequirement[] {
        return this.selectedTour?.requirements.filter(r => r.type === 'Meal') || [];
    }

    getAccommodationRequirements(): ServiceRequirement[] {
        return this.selectedTour?.requirements.filter(r => r.type === 'Accommodation') || [];
    }

    openOfferModal(requirement: ServiceRequirement) {
        this.selectedRequirement = requirement;
        this.showOfferModal = true;
        this.resetOfferForm();

        if (requirement.type === 'Meal') {
            // Set defaults for meal offers
            this.minimumPeople = Math.floor(requirement.estimatedPeople * 0.5);
            this.maximumPeople = requirement.estimatedPeople + 10;
        } else if (requirement.type === 'Accommodation') {
            // Set defaults for accommodation offers
            this.perRoomCapacity = 2; // Default 2 people per room
        }
    }

    closeOfferModal() {
        this.showOfferModal = false;
        this.selectedRequirement = null;
        this.resetOfferForm();
    }

    resetOfferForm() {
        // Meal fields
        this.pricePerHead = null;
        this.minimumPeople = null;
        this.maximumPeople = null;
        this.mealType = '';
        this.includesBeverages = false;

        // Accommodation fields
        this.rentPerNight = null;
        this.perRoomCapacity = null;
        this.description = '';

        // Common
        this.offerDetails = '';
    }

    get calculatedTotalRooms(): number {
        if (this.selectedRequirement && this.perRoomCapacity && this.perRoomCapacity > 0) {
            return Math.ceil(this.selectedRequirement.estimatedPeople / this.perRoomCapacity);
        }
        return 0;
    }

    get calculatedTotalRent(): number {
        if (this.rentPerNight && this.selectedRequirement?.stayDurationDays) {
            return this.calculatedTotalRooms * this.rentPerNight * this.selectedRequirement.stayDurationDays;
        }
        return 0;
    }

    submitOffer() {
        if (!this.selectedRequirement) {
            this.toastService.show('No requirement selected', 'warning');
            return;
        }

        // TODO: Get actual restaurant ID from auth service
        const restaurantId = 1; // Mock for now

        let offerData: any = {
            requirementId: this.selectedRequirement.requirementId,
            restaurantId: restaurantId,
            notes: this.offerDetails || null
        };

        if (this.selectedRequirement.type === 'Meal') {
            if (!this.pricePerHead || !this.minimumPeople || !this.maximumPeople) {
                this.toastService.show('Please fill in all required meal offer fields', 'warning');
                return;
            }

            offerData = {
                ...offerData,
                pricePerHead: this.pricePerHead,
                minimumPeople: this.minimumPeople,
                maximumPeople: this.maximumPeople,
                mealType: this.mealType || null,
                includesBeverages: this.includesBeverages
            };
        } else if (this.selectedRequirement.type === 'Accommodation') {
            if (!this.rentPerNight || !this.perRoomCapacity) {
                this.toastService.show('Please fill in all required accommodation offer fields', 'warning');
                return;
            }

            offerData = {
                ...offerData,
                rentPerNight: this.rentPerNight,
                perRoomCapacity: this.perRoomCapacity,
                totalRooms: this.calculatedTotalRooms,
                totalRent: this.calculatedTotalRent,
                stayDurationDays: this.selectedRequirement.stayDurationDays,
                notes: this.description || this.offerDetails || null
            };
        }

        this.http.post(`${environment.apiUrl}/api/restaurantoffers`, offerData).subscribe({
            next: (response) => {
                console.log('Offer submitted:', response);
                this.toastService.show(`Offer submitted successfully for "${this.selectedRequirement?.type}" requirement!`, 'success');
                this.closeOfferModal();
                this.loadTourRequirements(); // Refresh list
            },
            error: (err) => {
                console.error('Error submitting offer:', err);
                this.toastService.show('Failed to submit offer: ' + (err.error || err.message), 'error');
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

    formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getTypeIcon(type: string): string {
        return type === 'Meal' ? 'bi-cup-hot' : 'bi-building';
    }

    getTypeColor(type: string): string {
        return type === 'Meal' ? 'text-warning' : 'text-info';
    }
}
