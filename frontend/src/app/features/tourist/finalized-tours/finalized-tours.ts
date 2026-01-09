import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Tour {
  id: number;
  title: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  startDate: string;
  endDate: string;
  duration: string;
  daysRemaining?: number;
  progress?: number; // 0-100
  image: string;
  totalCost: number;

  // Details
  driver: {
    name: string;
    phone?: string;
  };
  accommodation: {
    name: string;
  };
  restaurant?: {
    name: string;
  };
  transportation: {
    type: string;
  };
}

@Component({
  selector: 'app-finalized-tours',
  imports: [CommonModule],
  templateUrl: './finalized-tours.html',
  styleUrl: './finalized-tours.css'
})
export class FinalizedTours {

  tours: Tour[] = [
    {
      id: 1,
      title: 'Beach Paradise Getaway',
      location: 'Maldives',
      status: 'Upcoming',
      startDate: '2026-01-27', // starts in 22 days from mock current time roughly
      endDate: '2026-02-02',
      duration: '7 Days',
      daysRemaining: 22,
      image: 'assets/images/maldives.jpg', // Placeholder, in real app would use real url
      totalCost: 5800,
      driver: {
        name: 'Ahmed Khan',
        phone: '+960 123 4567'
      },
      accommodation: {
        name: 'Ocean View Resort'
      },
      restaurant: {
        name: 'Ocean View Restaurant'
      },
      transportation: {
        type: 'Speedboat Transfer'
      }
    },
    {
      id: 2,
      title: 'Mountain Adventure Trek',
      location: 'Swiss Alps',
      status: 'Ongoing',
      startDate: '2025-11-15', // dates from screenshot
      endDate: '2025-11-25',
      duration: '10 Days',
      progress: 45,
      daysRemaining: 6,
      image: 'assets/images/swiss-alps.jpg',
      totalCost: 6200,
      driver: {
        name: 'Hans Mueller',
        phone: '+41 78 123 4567'
      },
      accommodation: {
        name: 'Alpine Lodge'
      },
      restaurant: {
        name: 'Alpine Bistro'
      },
      transportation: {
        type: 'Mountain Transport Van'
      }
    },
    {
      id: 3,
      title: 'Dubai City Exploration',
      location: 'Dubai, UAE',
      status: 'Completed',
      startDate: '2025-10-01',
      endDate: '2025-10-06',
      duration: '6 Days',
      image: 'assets/images/dubai.jpg',
      totalCost: 3400,
      driver: {
        name: 'Mohammed Ali',
        phone: '+971 50 123 4567'
      },
      accommodation: {
        name: 'Emirates Palace Hotel'
      },
      transportation: {
        type: 'Luxury SUV'
      }
    },
    {
      id: 4,
      title: 'Asian Cultural Experience',
      location: 'Kyoto, Japan',
      status: 'Upcoming',
      startDate: '2026-01-10',
      endDate: '2026-01-18',
      duration: '9 Days',
      daysRemaining: 62, // As per screenshot example (though dates might need adjustment to match exactly "starts in 62 days", using approx)
      image: 'assets/images/kyoto.jpg',
      totalCost: 4500,
      driver: {
        name: 'Takeshi Yamamoto',
        phone: '+81 90 1234 5678'
      },
      accommodation: {
        name: 'Ryokan Traditional Inn'
      },
      restaurant: {
        name: 'Kaiseki Traditional'
      },
      transportation: {
        type: 'Private Van'
      }
    }
  ];

  get completedCount(): number {
    return this.tours.filter(t => t.status === 'Completed').length;
  }

  get ongoingCount(): number {
    return this.tours.filter(t => t.status === 'Ongoing').length;
  }

  get upcomingCount(): number {
    return this.tours.filter(t => t.status === 'Upcoming').length;
  }

  // Helper to format currency
  formatCurrency(value: number): string {
    return '$' + value.toLocaleString();
  }
}
