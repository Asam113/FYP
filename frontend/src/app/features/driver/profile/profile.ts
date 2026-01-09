import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Document {
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  icon: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  profile = {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@safarnama.com',
    phone: '+92 300 1234567',
    joinedDate: 'June 15, 2024',
    location: 'Islamabad, Pakistan',
    status: 'Active',
    cnic: '12345-6789012-3',
    address: 'House 123, Street 45, F-10 Markaz, Islamabad'
  };

  license = {
    number: 'ISB-2345678',
    type: 'LTV (Light Transport Vehicle)',
    issueDate: 'Jan 10, 2020',
    expiryDate: 'Jan 10, 2027',
    status: 'Valid'
  };

  vehicle = {
    makeModel: 'Toyota Hiace',
    year: '2022',
    capacity: '15 Passengers'
  };

  documents: Document[] = [
    { name: 'Driving License', uploadDate: 'Jun 15, 2024', status: 'Verified', icon: 'bi-file-earmark-text' },
    { name: 'CNIC', uploadDate: 'Jun 15, 2024', status: 'Verified', icon: 'bi-file-person' },
    { name: 'Vehicle Registration', uploadDate: 'Jun 15, 2024', status: 'Verified', icon: 'bi-file-earmark-check' },
    { name: 'Route Permit', uploadDate: 'Jun 15, 2024', status: 'Verified', icon: 'bi-file-earmark-richtext' },
    { name: 'Insurance Certificate', uploadDate: 'Dec 28, 2025', status: 'Pending', icon: 'bi-file-earmark-pdf' }
  ];

  stats = {
    memberSince: 'June 15, 2024',
    totalTours: 24,
    totalEarnings: 'Rs. 45k',
    rating: 4.8
  };

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Verified': return 'bg-success-subtle text-success';
      case 'Pending': return 'bg-warning-subtle text-warning-emphasis';
      case 'Valid': return 'bg-success-subtle text-success';
      case 'Active': return 'bg-success-subtle text-success';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }
}
