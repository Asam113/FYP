import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tour {
    id: string;
    name: string;
    status: 'Finalized';
    statusClass: string;
    price: string;
    participants: number;
    client: string;
    destination: string;
    duration: string;
    transport: {
        hasService: boolean;
        provider?: string;
        details?: string;
    };
    accommodation: {
        hasService: boolean;
        provider?: string;
        details?: string;
    };
}

@Component({
    selector: 'app-finalized-tours',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './finalized-tours.html',
    styleUrl: './finalized-tours.css'
})
export class FinalizedTours {

    tours: Tour[] = [
        {
            id: 'T002',
            name: 'Lahore Heritage Tour',
            status: 'Finalized',
            statusClass: 'bg-primary text-white',
            price: 'PKR 120,000',
            participants: 12,
            client: 'Sarah Khan',
            destination: 'Lahore Walled City',
            duration: '2025-02-10 to 2025-02-12',
            transport: {
                hasService: true,
                provider: 'Lahore Transport Co.',
                details: 'PKR 30,000'
            },
            accommodation: {
                hasService: true,
                provider: 'Pearl Continental',
                details: 'PKR 60,000'
            }
        },
        {
            id: 'T005',
            name: 'Swat Valley Explorer',
            status: 'Finalized',
            statusClass: 'bg-primary text-white',
            price: 'PKR 180,000',
            participants: 6,
            client: 'Michael Brown',
            destination: 'Swat Valley',
            duration: '2025-03-01 to 2025-03-05',
            transport: {
                hasService: true,
                provider: 'Swat Travels',
                details: 'PKR 45,000'
            },
            accommodation: {
                hasService: true,
                provider: 'Swat Serena',
                details: 'PKR 90,000'
            }
        }
    ];

}
