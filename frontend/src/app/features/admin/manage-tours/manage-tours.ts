import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MenuSelectionModal } from '../../../shared/menu-selection-modal/menu-selection-modal';

// Backend API Interfaces
interface ApiTour {
  tourId: number;
  title: string;
  destination: string;
  departureLocation: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  basePrice: number;
  serviceRequirements: ApiServiceRequirement[];
  driverOffers: ApiDriverOffer[];
}

interface ApiServiceRequirement {
  requirementId: number;
  type: string;
  location: string;
  dateNeeded: string;
  time?: string;
  stayDurationDays?: number;
  estimatedPeople: number;
  estimatedBudget?: number;
  status: string;
  restaurantOffers: ApiRestaurantOffer[];
}

interface ApiDriverOffer {
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

interface ApiRestaurantOffer {
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

// Display Interfaces
interface Tour {
  id: number;
  name: string;
  status: 'Pending' | 'Ready to Finalize' | 'Pending Accommodation' | 'Awaiting Offers';
  statusClass: string;
  price: string;
  participants: number;
  destination: string;
  duration: string;
  transport: {
    hasService: boolean;
    status: 'Accepted' | 'Pending';
    provider?: string;
    details?: string;
    offersCount?: number;
  };
  accommodation: {
    hasService: boolean;
    status: 'Accepted' | 'Pending' | 'Alert';
    provider?: string;
    details?: string;
    offersCount?: number;
  };
}

interface DriverOffer {
  id: number;
  driverName: string;
  vehicleModel: string;
  vehicleParams: string;
  capacity: number;
  price: string;
  isApproved: boolean;
  offerId: number;
}

interface ServiceRequirement {
  requirementId: number;
  type: string;
  location: string;
  dateNeeded: string;
  details?: string;
  estimatedPeople: number;
  estimatedBudget?: number;
  status: string;
  offers?: RestaurantOffer[];
}

interface RestaurantOffer {
  offerId: number;
  restaurantName: string;
  pricePerHead: number;
  minimumPeople: number;
  maximumPeople: number;
  mealType?: string;
  includesBeverages: boolean;
  isApproved: boolean;
}

@Component({
  selector: 'app-manage-tours',
  standalone: true,
  imports: [CommonModule, MenuSelectionModal],
  templateUrl: './manage-tours.html',
  styleUrl: './manage-tours.css'
})
export class ManageTours implements OnInit {

  selectedTour: Tour | null = null;
  activeTab: 'transport' | 'services' = 'transport';

  // Transport Logic State
  filledCapacity: number = 0;
  remainingNeeded: number = 0;
  currentDriverOffers: DriverOffer[] = [];
  serviceRequirements: ServiceRequirement[] = [];

  // Menu selection modal state
  showMenuModal: boolean = false;
  selectedRequirement: ServiceRequirement | null = null;
  selectedOffer: RestaurantOffer | null = null;

  tours: Tour[] = [];
  loading = true;
  error = '';

  // Store raw API data
  private apiTours: ApiTour[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.http.get<ApiTour[]>('http://localhost:5238/api/tours')
      .subscribe({
        next: (apiTours) => {
          this.apiTours = apiTours;
          this.tours = apiTours.map(tour => this.mapApiTourToDisplayTour(tour));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading tours:', err);
          this.error = 'Failed to load tours';
          this.loading = false;
        }
      });
  }

  private mapApiTourToDisplayTour(apiTour: ApiTour): Tour {
    const driverOffers = apiTour.driverOffers || [];
    const acceptedDriverOffer = driverOffers.find(o => o.status?.toLowerCase() === 'accepted');
    const pendingDriverOffers = driverOffers.filter(o => o.status?.toLowerCase() === 'pending');

    const serviceRequirements = apiTour.serviceRequirements || [];
    const restaurantOffers = serviceRequirements
      .flatMap(req => req.restaurantOffers || []);
    const acceptedRestaurantOffer = restaurantOffers.find(o => o.status?.toLowerCase() === 'accepted');
    const pendingRestaurantOffers = restaurantOffers.filter(o => o.status?.toLowerCase() === 'pending');

    const hasAcceptedDriver = !!acceptedDriverOffer;
    const hasAcceptedRestaurant = !!acceptedRestaurantOffer;

    let status: Tour['status'];
    let statusClass: string;

    if (hasAcceptedDriver && hasAcceptedRestaurant) {
      status = 'Ready to Finalize';
      statusClass = 'bg-success text-white';
    } else if (hasAcceptedDriver && !hasAcceptedRestaurant) {
      status = 'Pending Accommodation';
      statusClass = 'bg-orange text-white';
    } else {
      status = 'Awaiting Offers';
      statusClass = 'bg-warning text-dark';
    }

    return {
      id: apiTour.tourId,
      name: apiTour.title || 'Untitled Tour',
      status,
      statusClass,
      price: `PKR ${(apiTour.basePrice || 0).toLocaleString()}`,
      participants: apiTour.maxCapacity || 0,
      destination: apiTour.destination || 'Unknown',
      duration: `${new Date(apiTour.startDate).toLocaleDateString()} to ${new Date(apiTour.endDate).toLocaleDateString()}`,
      transport: {
        hasService: driverOffers.length > 0,
        status: hasAcceptedDriver ? 'Accepted' : 'Pending',
        provider: acceptedDriverOffer?.driver?.user?.fullName,
        details: acceptedDriverOffer ? `PKR ${acceptedDriverOffer.transportationFare.toLocaleString()}` : undefined,
        offersCount: pendingDriverOffers.length
      },
      accommodation: {
        hasService: serviceRequirements.length > 0,
        status: hasAcceptedRestaurant ? 'Accepted' : (pendingRestaurantOffers.length > 0 ? 'Pending' : 'Alert'),
        provider: acceptedRestaurantOffer?.restaurant?.restaurantName,
        details: acceptedRestaurantOffer ? `PKR ${acceptedRestaurantOffer.pricePerPerson.toLocaleString()}/person` : undefined,
        offersCount: pendingRestaurantOffers.length
      }
    };
  }

  selectTour(tour: Tour) {
    this.selectedTour = tour;
    this.activeTab = 'transport';

    // Reset State
    this.filledCapacity = 0;
    this.remainingNeeded = tour.participants;

    // Load real data from API
    const apiTour = this.apiTours.find(t => t.tourId === tour.id);
    if (apiTour) {
      this.loadDriverOffers(apiTour);
      this.loadServiceRequirements(apiTour);
    }
  }

  private loadDriverOffers(apiTour: ApiTour): void {
    this.currentDriverOffers = (apiTour.driverOffers || []).map(offer => ({
      id: offer.offerId,
      offerId: offer.offerId,
      driverName: offer.driver.user.fullName,
      vehicleModel: offer.vehicle.model,
      vehicleParams: offer.vehicle.model,
      capacity: offer.vehicle.capacity,
      price: `PKR ${offer.transportationFare.toLocaleString()}`,
      isApproved: offer.status.toLowerCase() === 'accepted'
    }));

    // Calculate filled capacity from approved offers
    this.filledCapacity = this.currentDriverOffers
      .filter(o => o.isApproved)
      .reduce((sum, o) => sum + o.capacity, 0);
    this.calculateRemaining();
  }

  private loadServiceRequirements(apiTour: ApiTour): void {
    this.serviceRequirements = (apiTour.serviceRequirements || []).map(req => ({
      requirementId: req.requirementId,
      type: req.type,
      location: req.location,
      dateNeeded: req.dateNeeded,
      details: req.type === 'Meal' ? `${req.time || 'Time TBD'}` : `${req.stayDurationDays || 1} nights`,
      estimatedPeople: req.estimatedPeople,
      estimatedBudget: req.estimatedBudget,
      status: req.status,
      offers: (req.restaurantOffers || []).map(offer => ({
        offerId: offer.offerId,
        restaurantName: offer.restaurant.restaurantName,
        pricePerHead: offer.pricePerPerson,
        minimumPeople: 1,
        maximumPeople: 100,
        mealType: req.type,
        includesBeverages: false,
        isApproved: offer.status.toLowerCase() === 'accepted'
      }))
    }));
  }

  clearSelection() {
    this.selectedTour = null;
  }

  toggleDriverApproval(offer: DriverOffer) {
    if (!this.selectedTour) return;

    const newStatus = !offer.isApproved;

    // Call backend API to update offer status
    const endpoint = `http://localhost:5238/api/driver-offers/${offer.offerId}/${newStatus ? 'accept' : 'reject'}`;

    this.http.put(endpoint, {}).subscribe({
      next: () => {
        offer.isApproved = newStatus;
        if (newStatus) {
          this.filledCapacity += offer.capacity;
        } else {
          this.filledCapacity -= offer.capacity;
        }
        this.calculateRemaining();
      },
      error: (err) => {
        console.error('Error updating driver offer:', err);
        alert('Failed to update offer status');
      }
    });
  }

  calculateRemaining() {
    if (!this.selectedTour) return;
    const total = this.selectedTour.participants;
    this.remainingNeeded = total - this.filledCapacity;
  }

  getRequirementStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'bg-warning text-dark';
      case 'Fulfilled': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  approveRestaurantOffer(requirement: ServiceRequirement, offer: RestaurantOffer) {
    // Open menu selection modal
    this.selectedRequirement = requirement;
    this.selectedOffer = offer;
    this.showMenuModal = true;
  }

  onMenuConfirm(selectedItems: any[]) {
    if (!this.selectedRequirement || !this.selectedOffer) return;

    console.log('Confirming menu selection for offer:', this.selectedOffer.offerId);
    console.log('Selected items:', selectedItems);

    // Call backend API
    this.http.post(`http://localhost:5238/api/restaurant-offers/${this.selectedOffer.offerId}/accept`, { selectedMenuItems: selectedItems })
      .subscribe({
        next: () => {
          // Mark as approved
          this.selectedOffer!.isApproved = true;
          this.selectedRequirement!.status = 'Fulfilled';
          alert('Restaurant offer approved and order created!');
        },
        error: (err) => {
          console.error('Error approving restaurant offer:', err);
          alert('Failed to approve offer.');
        }
      });

    // Close modal
    this.showMenuModal = false;
    this.selectedRequirement = null;
    this.selectedOffer = null;
  }

  onMenuModalClose() {
    this.showMenuModal = false;
    this.selectedRequirement = null;
    this.selectedOffer = null;
  }

  unapproveRestaurantOffer(requirement: ServiceRequirement, offer: RestaurantOffer) {
    if (confirm('Unapprove this restaurant offer? This will delete the order.')) {
      this.http.put(`http://localhost:5238/api/restaurant-offers/${offer.offerId}/reject`, {})
        .subscribe({
          next: () => {
            offer.isApproved = false;
            requirement.status = 'Open';
            console.log('Unapproving offer:', offer.offerId);
            alert('Offer unapproved.');
          },
          error: (err) => {
            console.error('Error unapproving restaurant offer:', err);
            alert('Failed to unapprove offer.');
          }
        });
    }
  }

  rejectRestaurantOffer(offer: RestaurantOffer) {
    if (confirm('Reject this restaurant offer?')) {
      this.http.put(`http://localhost:5238/api/restaurant-offers/${offer.offerId}/reject`, {})
        .subscribe({
          next: () => {
            console.log('Rejecting offer:', offer.offerId);
            alert('Offer rejected');
            // Optionally remove the offer from the list or update its status in UI
          },
          error: (err) => {
            console.error('Error rejecting restaurant offer:', err);
            alert('Failed to reject offer.');
          }
        });
    }
  }

  canFinalizeTour(): boolean {
    if (!this.selectedTour) return false;

    // Check 1: Transport capacity fulfilled
    const transportFulfilled = this.filledCapacity >= this.selectedTour.participants;

    // Check 2: All requirements have accepted offers
    const allRequirementsFulfilled = this.serviceRequirements.every(req =>
      req.offers?.some(offer => offer.isApproved)
    );

    return transportFulfilled && allRequirementsFulfilled;
  }

  finalizeTour() {
    if (!this.selectedTour || !this.canFinalizeTour()) {
      alert('Cannot finalize: Please fulfill all transport and service requirements');
      return;
    }

    if (!confirm(`Finalize tour "${this.selectedTour.name}"? This will lock all approved offers and make the tour available for booking.`)) {
      return;
    }

    // Call backend API POST /api/tours/{id}/finalize
    console.log('Finalizing tour:', this.selectedTour.id);

    this.http.post(`http://localhost:5238/api/tours/${this.selectedTour.id}/finalize`, {})
      .subscribe({
        next: () => {
          alert('Tour finalized successfully! It is now ready for tourist bookings.');
          this.selectedTour!.status = 'Ready to Finalize'; // Update status
          // Reload tours to reflect the change
          this.loadTours();
          this.clearSelection();
        },
        error: (err) => {
          console.error('Finalization failed:', err);
          alert('Finalization failed: ' + (err.error?.message || 'Unknown error'));
        }
      });
  }

}
