import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tour {
  id: string;
  name: string;
  status: 'Pending' | 'Ready to Finalize' | 'Pending Accommodation' | 'Awaiting Offers';
  statusClass: string;
  price: string;
  participants: number;
  client: string;
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

@Component({
  selector: 'app-manage-tours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-tours.html',
  styleUrl: './manage-tours.css'
})
export class ManageTours {

  tours: Tour[] = [
    {
      id: 'T001',
      name: 'Northern Areas Adventure',
      status: 'Ready to Finalize',
      statusClass: 'bg-success text-white',
      price: 'PKR 240,000',
      participants: 8,
      client: 'John Smith',
      destination: 'Hunza Valley',
      duration: '2025-01-15 to 2025-01-20',
      transport: {
        hasService: true,
        status: 'Accepted',
        provider: 'Ali Khan',
        details: 'PKR 50,000'
      },
      accommodation: {
        hasService: true,
        status: 'Accepted',
        provider: 'Hunza Serena Inn',
        details: 'PKR 80,000'
      }
    },
    {
      id: 'T003',
      name: 'Karachi Coastal Tour',
      status: 'Pending Accommodation',
      statusClass: 'bg-orange text-white',
      price: 'PKR 80,000',
      participants: 4,
      client: 'Ahmed Ali',
      destination: 'Karachi Coast',
      duration: '2025-01-22 to 2025-01-24',
      transport: {
        hasService: true,
        status: 'Accepted',
        provider: 'Hassan Malik',
        details: 'PKR 20,000'
      },
      accommodation: {
        hasService: true,
        status: 'Alert',
        offersCount: 6
      }
    }
  ];

}
