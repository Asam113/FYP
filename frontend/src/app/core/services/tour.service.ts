import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tour } from '../models/tour.interface';

@Injectable({
    providedIn: 'root'
})
export class TourService {

    private tours: Tour[] = [
        {
            id: 1,
            name: 'Muree, Nathiagali',
            description: 'Experience the serene beauty of Muree and Nathiagali with our exclusive 3-day tour package. Includes hotel stay and guided tours.',
            price: 15000,
            couplePrice: 28000,
            totalSeats: 20,
            seatsBooked: 12,
            location: 'Islamabad',
            destination: 'Muree',
            duration: '3 Days',
            startDate: '2025-12-30',
            endDate: '2026-01-02',
            imageUrl: 'https://placehold.co/800x600/1e293b/FFF?text=Muree+Hills',
            rating: 4.8,
            type: 'Single',
            vehicles: 2
        },
        {
            id: 2,
            name: 'Naran Kaghan',
            description: 'A 5-day adventure to the stunning Naran and Kaghan valleys. Visit Lake Saif-ul-Malook and Babusar Top.',
            price: 25000,
            totalSeats: 15,
            seatsBooked: 5,
            location: 'Lahore',
            destination: 'Naran',
            duration: '5 Days',
            startDate: '2026-06-15',
            endDate: '2026-06-20',
            imageUrl: 'https://placehold.co/800x600/0d6efd/FFF?text=Naran+Valley',
            rating: 4.9,
            type: 'Multi',
            vehicles: 1,
            destinations: ['Naran', 'Kaghan', 'Babusar Top']
        },
        {
            id: 3,
            name: 'Hunza Valley',
            description: 'Discover the majestic Hunza Valley. Witness the Rakaposhi view point, Altit and Baltit forts.',
            price: 45000,
            couplePrice: 85000,
            totalSeats: 12,
            seatsBooked: 12,
            location: 'Islamabad',
            destination: 'Hunza',
            duration: '7 Days',
            imageUrl: 'https://placehold.co/800x600/198754/FFF?text=Hunza+Peaks',
            rating: 5.0,
            type: 'Single',
            vehicles: 3
        },
        {
            id: 4,
            name: 'Skardu',
            description: 'Explore the gateway to the giants. Skardu tour includes visits to Shangrila Resort and Deosai Plains.',
            price: 40000,
            totalSeats: 10,
            seatsBooked: 2,
            location: 'Islamabad',
            destination: 'Skardu',
            duration: '6 Days',
            imageUrl: 'https://placehold.co/800x600/6610f2/FFF?text=Skardu+Resort',
            rating: 4.7,
            type: 'Single',
            vehicles: 2
        }
    ];

    constructor() { }

    getTours(): Observable<Tour[]> {
        return of(this.tours);
    }

    getTourById(id: number): Observable<Tour | undefined> {
        const tour = this.tours.find(t => t.id === id);
        return of(tour);
    }
}
