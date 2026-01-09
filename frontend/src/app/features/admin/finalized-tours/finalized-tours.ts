import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FinalizedTour {
    id: string;
    name: string;
    status: 'Accepting Bookings' | 'Fully Booked';
    statusClass: string;
    price: string;
    profit: string;
    pricePerPerson: string;
    participants: number; // current bookings
    totalSeats: number;
    availableSeats: number;
    bookingProgress: number; // percentage
    client: string; // Organizer
    destination: string;
    duration: string;
    transport: {
        provider: string;
        cost: string;
    };
    accommodation: {
        provider: string;
        cost: string;
    };
    bookings: {
        name: string;
        seats: number;
        total: string;
        status: 'Confirmed' | 'Pending Payment';
        statusClass: string;
    }[];
}

@Component({
    selector: 'app-finalized-tours',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './finalized-tours.html',
    styleUrl: './finalized-tours.css'
})
export class FinalizedTours {

    tours: FinalizedTour[] = [
        {
            id: 'T002',
            name: 'Lahore Heritage Tour',
            status: 'Accepting Bookings',
            statusClass: 'bg-success',
            price: 'PKR 288,000',
            profit: 'PKR 193,000',
            pricePerPerson: 'PKR 24,000',
            participants: 12,
            totalSeats: 15,
            availableSeats: 3,
            bookingProgress: 80,
            client: 'Sarah Khan',
            destination: 'Lahore',
            duration: '2025-02-10 to 2025-02-12',
            transport: {
                provider: 'Ahmed Raza',
                cost: 'PKR 35,000'
            },
            accommodation: {
                provider: 'Luxury Hotel Lahore',
                cost: 'PKR 60,000'
            },
            bookings: [
                { name: 'Sarah Khan', seats: 3, total: 'PKR 72,000', status: 'Confirmed', statusClass: 'bg-success text-white' },
                { name: 'Ali Ahmed', seats: 2, total: 'PKR 48,000', status: 'Confirmed', statusClass: 'bg-success text-white' },
                { name: 'Fatima Noor', seats: 4, total: 'PKR 96,000', status: 'Confirmed', statusClass: 'bg-success text-white' }
            ]
        },
        {
            id: 'T004',
            name: 'Murree Weekend Getaway',
            status: 'Fully Booked',
            statusClass: 'bg-purple',
            price: 'PKR 400,000',
            profit: 'PKR 280,000',
            pricePerPerson: 'PKR 20,000',
            participants: 20,
            totalSeats: 20,
            availableSeats: 0,
            bookingProgress: 100,
            client: 'Hassan Ali',
            destination: 'Murree',
            duration: '2025-02-15 to 2025-02-17',
            transport: {
                provider: 'Murree Transport Service',
                cost: 'PKR 40,000'
            },
            accommodation: {
                provider: 'Murree Hills Hotel',
                cost: 'PKR 80,000'
            },
            bookings: [
                { name: 'Hassan Ali', seats: 3, total: 'PKR 72,000', status: 'Pending Payment', statusClass: 'bg-orange text-white' },
                { name: 'Bilal Khan', seats: 5, total: 'PKR 100,000', status: 'Confirmed', statusClass: 'bg-success text-white' }
                // ... more bookings
            ]
        }
    ];

}
