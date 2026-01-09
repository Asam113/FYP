import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RequestSummary {
  title: string;
  value: string | number;
  subtext?: string;
}

interface RequestItem {
  tourName: string;
  status: 'Pending' | 'Under Review';
  submittedTime: string;
  tourDate: string;
  tourists: string;
  mealType: string;
  pricePerHead: number;
  totalAmount: number;
  calculation: string;
}

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {

  summaryStats: RequestSummary[] = [
    { title: 'Total Pending Requests', value: 5 },
    { title: 'Total Pending Value', value: 'PKR 293,250' },
    { title: 'Under Review', value: 2 }
  ];

  requests: RequestItem[] = [
    {
      tourName: 'Murree Hill Station Tour',
      status: 'Pending',
      submittedTime: 'Submitted 2 hours ago',
      tourDate: 'Jan 15, 2026',
      tourists: '35 people',
      mealType: 'Lunch',
      pricePerHead: 1200,
      totalAmount: 42000,
      calculation: '1,200 × 35 tourists'
    },
    {
      tourName: 'Hunza Valley Adventure',
      status: 'Under Review',
      submittedTime: 'Submitted 1 day ago',
      tourDate: 'Jan 20, 2026',
      tourists: '50 people',
      mealType: 'Dinner',
      pricePerHead: 1700,
      totalAmount: 85000,
      calculation: '1,700 × 50 tourists'
    },
    {
      tourName: 'Swat Valley Exploration',
      status: 'Pending',
      submittedTime: 'Submitted 2 days ago',
      tourDate: 'Jan 25, 2026',
      tourists: '40 people',
      mealType: 'Lunch & Dinner',
      pricePerHead: 1550,
      totalAmount: 62000, // Note: Screenshots might vary slightly, using estimated values based on screenshot context or placeholder if distinct
      calculation: '1,550 × 40 tourists'
    },
    {
      tourName: 'Naran Kaghan Trip', // Placeholder based on general tourism context as screenshot cuts off
      status: 'Pending',
      submittedTime: 'Submitted 3 days ago',
      tourDate: 'Feb 1, 2026',
      tourists: '45 people',
      mealType: 'Dinner',
      pricePerHead: 1450,
      totalAmount: 65250,
      calculation: '1,450 × 45 tourists'
    },
    {
      tourName: 'Skardu Adventure',
      status: 'Pending',
      submittedTime: 'Submitted 4 days ago',
      tourDate: 'Feb 5, 2026',
      tourists: '30 people',
      mealType: 'Lunch',
      pricePerHead: 1300,
      totalAmount: 39000,
      calculation: '1,300 × 30 tourists'
    }
  ];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning-subtle text-warning border-warning-subtle';
      case 'Under Review': return 'bg-primary-subtle text-primary border-primary-subtle';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  getIconClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock-history';
      case 'Under Review': return 'bi-hourglass-split';
      default: return 'bi-circle';
    }
  }
}
