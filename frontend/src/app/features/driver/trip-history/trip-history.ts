import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-trip-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trip-history.html',
    styleUrl: './trip-history.css'
})
export class TripHistory {
    stats = {
        totalEarnings: 'Rs. 28,500',
        totalTrips: 6,
        averageRating: '4.8 / 5.0'
    };

    trips = [
        {
            id: 1,
            title: 'Nathia Gali Winter Tour',
            status: 'Completed',
            route: 'Islamabad → Nathia Gali',
            date: 'Dec 28, 2025',
            duration: '2 Days',
            price: 'Rs. 7,500',
            rating: 5,
            feedback: 'Excellent driver! Very professional and punctual.'
        },
        {
            id: 2,
            title: 'Karachi City Tour',
            status: 'Completed',
            route: 'Karachi → Clifton → Port Grand',
            date: 'Dec 20, 2025',
            duration: '1 Day',
            price: 'Rs. 4,500',
            rating: 4.8,
            feedback: 'Great experience, smooth ride.'
        },
        {
            id: 3,
            title: 'Khewra Salt Mines Tour',
            status: 'Completed',
            route: 'Islamabad → Khewra → Chakwal',
            date: 'Dec 15, 2025',
            duration: '1 Day',
            price: 'Rs. 5,000',
            rating: 4.9,
            feedback: 'Very knowledgeable about the routes.'
        },
        {
            id: 4,
            title: 'Faisal Mosque & Daman-e-Koh',
            status: 'Completed',
            route: 'Islamabad City Tour',
            date: 'Dec 10, 2025',
            duration: '5 Hours',
            price: 'Rs. 3,000',
            rating: 4.7,
            feedback: 'Good service.'
        },
        {
            id: 5,
            title: 'Kalar Kahar & Choa Saidan Shah',
            status: 'Completed',
            route: 'Rawalpindi → Kalar Kahar',
            date: 'Dec 5, 2025',
            duration: '1 Day',
            price: 'Rs. 6,000',
            rating: 5,
            feedback: 'Amazing driver! Will recommend.'
        },
        {
            id: 6,
            title: 'Margalla Hills Trail',
            status: 'Completed',
            route: 'Islamabad → Trail 3 → Trail 5',
            date: 'Nov 28, 2025',
            duration: '4 Hours',
            price: 'Rs. 2,500',
            rating: 4.6,
            feedback: 'Punctual and friendly.'
        }
    ];
}
