import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Notification {
    id: number;
    type: 'success' | 'info' | 'warning' | 'danger' | 'primary';
    icon: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

@Component({
    selector: 'app-shared-notifications',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notifications.html'
})
export class SharedNotificationsComponent implements OnInit {
    notifications: Notification[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        const url = this.router.url;
        if (url.includes('/admin')) {
            this.notifications = this.getAdminNotifications();
        } else if (url.includes('/restaurant')) {
            this.notifications = this.getRestaurantNotifications();
        } else if (url.includes('/driver')) {
            this.notifications = this.getDriverNotifications();
        } else if (url.includes('/tourist')) {
            this.notifications = this.getTouristNotifications();
        }
    }

    getAdminNotifications(): Notification[] {
        return [
            {
                id: 1,
                type: 'info',
                icon: 'bi-person-plus',
                title: 'New Driver Registration',
                message: 'Driver "Ahmed Khan" has registered and is awaiting approval.',
                time: '1 hour ago',
                read: false
            },
            {
                id: 2,
                type: 'warning',
                icon: 'bi-shop',
                title: 'Restaurant Verification Pending',
                message: 'New restaurant "Spice Bazaar" requires document verification.',
                time: '3 hours ago',
                read: false
            },
            {
                id: 3,
                type: 'success',
                icon: 'bi-cash-coin',
                title: 'Monthly Subscription Received',
                message: 'Received subscription payment from "Serena Hotel".',
                time: '1 day ago',
                read: true
            }
        ];
    }

    getRestaurantNotifications(): Notification[] {
        return [
            {
                id: 1,
                type: 'success',
                icon: 'bi-cart-check',
                title: 'New Order Received',
                message: 'You have a new order #1234 from "Tour Group A".',
                time: '10 mins ago',
                read: false
            },
            {
                id: 2,
                type: 'info',
                icon: 'bi-star',
                title: 'New Review',
                message: 'Customer left a 5-star review for your lunch service.',
                time: '2 hours ago',
                read: true
            },
            {
                id: 3,
                type: 'warning',
                icon: 'bi-exclamation-triangle',
                title: 'Stock Alert',
                message: 'Inventory running low for "Chicken Karahi".',
                time: '5 hours ago',
                read: true
            }
        ];
    }

    getDriverNotifications(): Notification[] {
        return [
            {
                id: 1,
                type: 'success',
                icon: 'bi-check-circle',
                title: 'Booking Accepted',
                message: 'Your application for "Murree Hill Station Tour" has been accepted by the admin.',
                time: '2 hours ago',
                read: false
            },
            {
                id: 2,
                type: 'primary',
                icon: 'bi-calendar-check',
                title: 'Tour Finalized',
                message: 'The "Lahore Heritage Tour" has been finalized. All requirements completed.',
                time: '5 hours ago',
                read: false
            },
            {
                id: 3,
                type: 'success',
                icon: 'bi-currency-dollar',
                title: 'Payment Received',
                message: 'Rs. 8,500 payment for "Murree Hill Station Tour" has been credited to your account.',
                time: '1 day ago',
                read: false
            }
        ];
    }

    getTouristNotifications(): Notification[] {
        return [
            {
                id: 1,
                type: 'success',
                icon: 'bi-ticket-perforated',
                title: 'Booking Confirmed',
                message: 'Your booking for "Naran Kaghan Trip" has been confirmed.',
                time: '30 mins ago',
                read: false
            },
            {
                id: 2,
                type: 'info',
                icon: 'bi-geo-alt',
                title: 'Tour Update',
                message: 'The departure point for your upcoming tour has been updated to vaguely defined location.',
                time: '4 hours ago',
                read: true
            },
            {
                id: 3,
                type: 'primary',
                icon: 'bi-brightness-high',
                title: 'Weather Alert',
                message: 'Sunny weather expected for your trip to Hunza next week!',
                time: '1 day ago',
                read: true
            }
        ];
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    clearAll() {
        this.notifications = [];
    }

    getIconClass(type: string): string {
        switch (type) {
            case 'success': return 'text-success bg-success-subtle';
            case 'primary': return 'text-primary bg-primary-subtle';
            case 'warning': return 'text-warning bg-warning-subtle';
            case 'danger': return 'text-danger bg-danger-subtle';
            case 'info': return 'text-info bg-info-subtle';
            default: return 'text-primary bg-primary-subtle';
        }
    }
}
