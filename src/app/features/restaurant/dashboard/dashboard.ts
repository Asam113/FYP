import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  count: number;
  icon: string;
  colorClass: string;
}

interface Tour {
  id: string;
  departure: string;
  destination: string;
  arrivalDate: Date;
  tourists: number;
  service: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

interface OngoingTour extends Tour {
  arrivalTime: string;
  servicesProvided: string[];
}

interface ServiceSummary {
  mealsServed: number;
  totalMeals: number;
  roomsOccupied: number;
  totalRooms: number;
}

interface Alert {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Mock Data for Dashboard
  stats: StatCard[] = [
    { title: 'Associated Tours', count: 124, icon: 'bi-geo-alt-fill', colorClass: 'primary' },
    { title: 'Upcoming Tours', count: 8, icon: 'bi-calendar-event-fill', colorClass: 'info' },
    { title: 'Ongoing Tours', count: 3, icon: 'bi-play-circle-fill', colorClass: 'success' },
    { title: 'Completed Tours', count: 110, icon: 'bi-check-circle-fill', colorClass: 'secondary' },
    { title: 'Pending Services', count: 5, icon: 'bi-hourglass-split', colorClass: 'warning' }
  ];

  upcomingTours: Tour[] = [
    { id: 'TR-2025-001', departure: 'Rawalpindi', destination: 'Murree', arrivalDate: new Date('2025-12-28'), tourists: 12, service: 'Both', status: 'Upcoming' },
    { id: 'TR-2025-005', departure: 'Islamabad', destination: 'Swat', arrivalDate: new Date('2025-12-29'), tourists: 20, service: 'Meal', status: 'Upcoming' },
    { id: 'TR-2025-008', departure: 'Karachi', destination: 'Hunza', arrivalDate: new Date('2025-12-30'), tourists: 8, service: 'Room', status: 'Upcoming' },
    { id: 'TR-2025-012', departure: 'Lahore', destination: 'Naran', arrivalDate: new Date('2025-12-31'), tourists: 15, service: 'Both', status: 'Upcoming' }
  ];

  ongoingTours: OngoingTour[] = [
    {
      id: 'TR-2024-998', departure: 'Faisalabad', destination: 'Murree', arrivalDate: new Date('2025-12-27'),
      tourists: 15, service: 'Both', status: 'Ongoing', arrivalTime: '10:30 AM',
      servicesProvided: ['Lunch', 'Dinner']
    },
    {
      id: 'TR-2024-999', departure: 'Multan', destination: 'Ayubia', arrivalDate: new Date('2025-12-27'),
      tourists: 5, service: 'Meal', status: 'Ongoing', arrivalTime: '01:00 PM',
      servicesProvided: ['Lunch']
    }
  ];

  todayService: ServiceSummary = {
    mealsServed: 45,
    totalMeals: 120,
    roomsOccupied: 12,
    totalRooms: 15
  };

  alerts: Alert[] = [
    { id: 1, message: 'New tour booking assigned: TR-2025-012', type: 'info', time: '10 mins ago' },
    { id: 2, message: 'Room availability low for Dec 31st', type: 'warning', time: '2 hours ago' },
    { id: 3, message: 'Payment received for Tour TR-2024-990', type: 'success', time: 'Yesterday' }
  ];

  getMealProgress(): number {
    return (this.todayService.mealsServed / this.todayService.totalMeals) * 100;
  }

  getRoomProgress(): number {
    return (this.todayService.roomsOccupied / this.todayService.totalRooms) * 100;
  }
}
