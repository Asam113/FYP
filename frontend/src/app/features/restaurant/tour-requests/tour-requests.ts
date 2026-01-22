import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ServiceRequirement {
    requirementId: number;
    type: string; // "Meal" or "Accommodation"
    location: string;
    dateNeeded: string;
    details?: string;
    estimatedPeople: number;
    estimatedBudget?: number;
    status: string;
    tour?: {
        tourId: number;
        title: string;
        startDate: string;
        endDate: string;
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
    requirements: ServiceRequirement[] = [];
    filteredRequirements: ServiceRequirement[] = [];
    isLoading = true;

    // Filters
    filterType: string = 'All';
    filterStatus: string = 'Open';

    // Modal state
    showOfferModal = false;
    selectedRequirement: ServiceRequirement | null = null;

    // Offer form
    pricePerHead: number | null = null;
    minimumPeople: number | null = null;
    maximumPeople: number | null = null;
    mealType: string = '';
    includesBeverages: boolean = false;
    offerDetails: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadRequirements();
    }

    loadRequirements() {
        const params = this.filterStatus !== 'All' ? `?status=${this.filterStatus}` : '';

        this.http.get<ServiceRequirement[]>(`http://localhost:5238/api/servicerequirements${params}`).subscribe({
            next: (data) => {
                this.requirements = data;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading requirements:', err);
                this.isLoading = false;
            }
        });
    }

    applyFilters() {
        this.filteredRequirements = this.requirements.filter(req => {
            const typeMatch = this.filterType === 'All' || req.type === this.filterType;
            return typeMatch;
        });
    }

    onFilterChange() {
        this.applyFilters();
    }

    openOfferModal(requirement: ServiceRequirement) {
        this.selectedRequirement = requirement;
        this.showOfferModal = true;
        this.resetOfferForm();

        // Set defaults based on requirement
        this.minimumPeople = Math.floor(requirement.estimatedPeople * 0.5);
        this.maximumPeople = requirement.estimatedPeople + 10;
    }

    closeOfferModal() {
        this.showOfferModal = false;
        this.selectedRequirement = null;
        this.resetOfferForm();
    }

    resetOfferForm() {
        this.pricePerHead = null;
        this.minimumPeople = null;
        this.maximumPeople = null;
        this.mealType = '';
        this.includesBeverages = false;
        this.offerDetails = '';
    }

    submitOffer() {
        if (!this.selectedRequirement || !this.pricePerHead || !this.minimumPeople || !this.maximumPeople) {
            alert('Please fill in all required fields');
            return;
        }

        // TODO: Get actual restaurant ID from auth service
        const restaurantId = 1; // Mock for now

        const offerData = {
            requirementId: this.selectedRequirement.requirementId,
            restaurantId: restaurantId,
            pricePerHead: this.pricePerHead,
            minimumPeople: this.minimumPeople,
            maximumPeople: this.maximumPeople,
            mealType: this.mealType || null,
            includesBeverages: this.includesBeverages,
            details: this.offerDetails || null
        };

        this.http.post('http://localhost:5238/api/restaurantoffers', offerData).subscribe({
            next: (response) => {
                console.log('Offer submitted:', response);
                alert(`Offer submitted successfully for "${this.selectedRequirement?.type}" requirement!`);
                this.closeOfferModal();
                this.loadRequirements(); // Refresh list
            },
            error: (err) => {
                console.error('Error submitting offer:', err);
                alert('Failed to submit offer: ' + (err.error || err.message));
            }
        });
    }

    formatDate(dateString: string): string {
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
