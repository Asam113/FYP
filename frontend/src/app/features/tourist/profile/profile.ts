import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
  memberSince: string;
  totalTours: number;
  cnic: string;
  passport: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  adventureLevel: string;
  dietary: string;
  medical: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user: UserProfile = {
    firstName: 'Ahmed',
    lastName: 'Shah',
    email: 'ahmed.shah@email.com',
    phone: '+92 300 1234567',
    dob: '05/15/1995',
    role: 'Tourist',
    memberSince: 'January 2024',
    totalTours: 12,
    cnic: '42101-1234567-8',
    passport: 'AB1234567',
    address: 'House 123, Street 4, Islamabad',
    emergencyContactName: 'Sara Shah',
    emergencyContactNumber: '+92 321 9876543',
    adventureLevel: 'Moderate',
    dietary: 'None',
    medical: 'None'
  }

  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  get initials(): string {
    return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
  }
}
