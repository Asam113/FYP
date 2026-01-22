import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequest, ServiceType, ServiceRequestStatus } from '../../../core/models/service-request';
import { ServiceOffer, PricingUnit, OfferStatus } from '../../../core/models/service-offer';

@Component({
    selector: 'app-find-trips',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './find-trips.html',
    styleUrl: './find-trips.css'
})
export class FindTrips {

    // Mock Data mimicking Transport requests
    requests: ServiceRequest[] = [
        {
            serviceRequestId: 501,
            tourId: 55,
            serviceType: ServiceType.Transport,
            location: 'Islamabad -> Naran',
            dateNeeded: '2026-06-15',
            estimatedBudget: 50000,
            status: ServiceRequestStatus.Open
        },
        {
            serviceRequestId: 502,
            tourId: 62,
            serviceType: ServiceType.Transport,
            location: 'Lahore -> Hunza',
            dateNeeded: '2026-07-01',
            estimatedBudget: 150000,
            status: ServiceRequestStatus.Open
        }
    ];

    selectedRequest: ServiceRequest | null = null;

    // Offer Form
    offerPrice: number | null = null;
    offerDescription: string = '';

    openOfferModal(req: ServiceRequest) {
        this.selectedRequest = req;
        this.offerPrice = null;
        this.offerDescription = '';
    }

    closeOfferModal() {
        this.selectedRequest = null;
    }

    submitOffer() {
        if (!this.selectedRequest || !this.offerPrice) return;

        const newOffer: ServiceOffer = {
            serviceRequestId: this.selectedRequest.serviceRequestId!,
            vendorId: 2, // Driver ID
            price: this.offerPrice,
            unit: PricingUnit.FixedTotal, // Usually fixed for transport trips
            quantityOffered: 1,
            description: this.offerDescription,
            status: OfferStatus.Pending
        };

        console.log('Submitting Transport Bid:', newOffer);
        alert('Bid Sent Successfully!');
        this.closeOfferModal();
    }
}
