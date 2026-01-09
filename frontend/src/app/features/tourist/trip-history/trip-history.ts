import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Trip {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    duration: string;
    travelers: number;
    cost: number;
    status: 'Completed' | 'Cancelled' | 'Refunded';
    rating: number;
    review: string;
    image: string;
}

@Component({
    selector: 'app-trip-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trip-history.html',
    styleUrl: './trip-history.css'
})
export class TripHistory {
    trips: Trip[] = [
        {
            id: 'TR-2025-015',
            title: 'Fairy Meadows Expedition',
            destination: 'Nanga Parbat Base',
            startDate: '15 Nov 2025',
            endDate: '16 Nov 2025',
            duration: '1 Days',
            travelers: 1,
            cost: 8000,
            status: 'Completed',
            rating: 5,
            review: 'Absolutely breathtaking experience! The views were stunning and the guide was very professional.',
            image: 'assets/images/fairy-meadows.jpg'
        },
        {
            id: 'TR-2025-012',
            title: 'Hunza Valley Autumn Tour',
            destination: 'Karimabad, Hunza',
            startDate: '10 Oct 2025',
            endDate: '11 Oct 2025',
            duration: '1 Days',
            travelers: 1,
            cost: 12000,
            status: 'Completed',
            rating: 4.5,
            review: 'Great trip overall regarding logistics. The hotel in Passu could have been better.',
            image: 'assets/images/hunza.jpg'
        },
        {
            id: 'TR-2025-008',
            title: 'Skardu & Deosai Plains',
            destination: 'Skardu',
            startDate: '12 Aug 2025',
            endDate: '13 Aug 2025',
            duration: '1 Days',
            travelers: 1,
            cost: 14000,
            status: 'Completed',
            rating: 5,
            review: 'Deosai was magical. The jeep ride was bumpy but totally worth it!',
            image: 'assets/images/skardu.jpg'
        },
        {
            id: 'TR-2025-005',
            title: 'Swat Valley Cultural Tour',
            destination: 'Swat, Kalam',
            startDate: '20 Jul 2025',
            endDate: '22 Jul 2025',
            duration: '2 Days',
            travelers: 1,
            cost: 16500,
            status: 'Completed',
            rating: 4,
            review: 'Beautiful scenery. A bit crowded at Mahodand Lake but acceptable.',
            image: 'assets/images/swat.jpg'
        },
        {
            id: 'TR-2025-002',
            title: 'Nathia Gali Weekend',
            destination: 'Galiyat',
            startDate: '05 May 2025',
            endDate: '06 May 2025',
            duration: '1 Days',
            travelers: 1,
            cost: 3000,
            status: 'Completed',
            rating: 4.8,
            review: 'A perfect relaxing weekend getaway. The pipeline track walk was refreshing.',
            image: 'assets/images/nathia-gali.jpg'
        },
        {
            id: 'TR-2024-098',
            title: 'Lahore Historical Tour',
            destination: 'Walled City, Lahore',
            startDate: '15 Dec 2024',
            endDate: '15 Dec 2024',
            duration: '1 Days',
            travelers: 1,
            cost: 4000,
            status: 'Completed',
            rating: 4.2,
            review: 'Very informative tour guide. The food street dinner was the highlight.',
            image: 'assets/images/lahore.jpg'
        }
    ];

    get totalTrips(): number {
        return this.trips.filter(t => t.status === 'Completed').length;
    }

    get totalSpent(): number {
        return this.trips.reduce((acc, trip) => acc + trip.cost, 0);
    }

    get avgRating(): number {
        if (this.trips.length === 0) return 0;
        const total = this.trips.reduce((acc, trip) => acc + trip.rating, 0);
        return Number((total / this.trips.length).toFixed(1));
    }
}
