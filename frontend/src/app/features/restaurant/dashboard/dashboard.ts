import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface StatCard {
  title: string;
  count: number;
  subtext: string;
  icon: string;
  colorClass: string; // 'primary', 'warning', 'success', 'info' (mapped to purple)
}

interface ActivityItem {
  tourName: string;
  status: 'Offer Sent' | 'Offer Approved' | 'Order Confirmed';
  time: string;
  price: number;
  badgeStatus: 'Pending' | 'Approved' | 'Confirmed';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  hasMenuItems = true; // Assume true initially
  hasRooms = true; // Assume true initially
  businessType: string = '';
  restaurantId: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.businessType = user.businessType || '';
      this.restaurantId = user.roleSpecificId || 0;
    }

    if (this.showMenuAlert()) {
      this.checkMenuItems();
    }
    if (this.showRoomsAlert()) {
      this.checkRoomCategories();
    }
  }

  checkMenuItems() {
    this.http.get<any[]>(`${environment.apiUrl}/api/RestaurantMenu`).subscribe({
      next: (menus) => {
        this.hasMenuItems = menus.some(menu => menu.menuItems && menu.menuItems.length > 0);
      },
      error: (err) => {
        console.error('Error checking menu items:', err);
        this.hasMenuItems = false;
      }
    });
  }

  checkRoomCategories() {
    if (!this.restaurantId) return;
    this.http.get<any[]>(`${environment.apiUrl}/api/restaurants/${this.restaurantId}/room-categories`).subscribe({
      next: (categories) => {
        this.hasRooms = categories.length > 0;
      },
      error: (err) => {
        console.error('Error checking room categories:', err);
        this.hasRooms = false;
      }
    });
  }

  showMenuAlert(): boolean {
    return this.businessType === 'Restaurant' || this.businessType === 'Hotel';
  }

  showRoomsAlert(): boolean {
    return this.businessType === 'GuestHouse' || this.businessType === 'Guest House' || this.businessType === 'Hotel';
  }

  stats: StatCard[] = [
    {
      title: 'Total Food Offers Sent',
      count: 24,
      subtext: '+12% from last month',
      icon: 'bi-graph-up-arrow',
      colorClass: 'primary' // Blue
    },
    {
      title: 'Pending Tour Requests',
      count: 8,
      subtext: 'Awaiting admin approval',
      icon: 'bi-clock-history',
      colorClass: 'warning' // Yellow
    },
    {
      title: 'Confirmed Tour Orders',
      count: 16,
      subtext: '+8 this month',
      icon: 'bi-check-lg',
      colorClass: 'success' // Green
    },
    {
      title: 'Active Menu Items',
      count: 42,
      subtext: 'Across 5 menus',
      icon: 'bi-exclamation-circle',
      colorClass: 'purple' // Purple (custom class we will add)
    }
  ];

  recentActivities: ActivityItem[] = [
    {
      tourName: 'Murree Hill Station Tour',
      status: 'Offer Sent',
      time: '2 hours ago',
      price: 45000,
      badgeStatus: 'Pending'
    },
    {
      tourName: 'Hunza Valley Adventure',
      status: 'Offer Approved',
      time: '5 hours ago',
      price: 85000,
      badgeStatus: 'Approved'
    },
    {
      tourName: 'Lahore Heritage Tour',
      status: 'Order Confirmed',
      time: '1 day ago',
      price: 32000,
      badgeStatus: 'Confirmed'
    },
    {
      tourName: 'Swat Valley Exploration',
      status: 'Offer Sent',
      time: '2 days ago',
      price: 62000,
      badgeStatus: 'Pending'
    },
    {
      tourName: 'Islamabad City Tour',
      status: 'Offer Approved',
      time: '3 days ago',
      price: 28000,
      badgeStatus: 'Approved'
    }
  ];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning-subtle text-warning';
      case 'Approved': return 'bg-primary-subtle text-primary';
      case 'Confirmed': return 'bg-success-subtle text-success';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }
}
