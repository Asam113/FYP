import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TourRequest {
  id: number;
  title: string;
  route: string;
  duration: string;
  date: string;
  appliedDate: string;
  price: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminStatus: 'Awaiting admin approval' | 'Approved';
}

@Component({
  selector: 'app-requests',
  inputs: [],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {
  requests: TourRequest[] = [
    {
      id: 1,
      title: 'Swat Valley Adventure',
      route: 'Islamabad → Swat',
      duration: '3 Days',
      date: 'Jan 25, 2026',
      appliedDate: 'Jan 5, 2026',
      price: 15000,
      status: 'Pending',
      adminStatus: 'Awaiting admin approval'
    },
    {
      id: 2,
      title: 'Naran Kaghan Tour',
      route: 'Islamabad → Naran',
      duration: '5 Days',
      date: 'Feb 2, 2026',
      appliedDate: 'Jan 4, 2026',
      price: 22000,
      status: 'Pending',
      adminStatus: 'Awaiting admin approval'
    }
  ];
}
