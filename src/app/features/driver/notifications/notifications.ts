import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
    selector: 'app-driver-notifications',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notifications.html'
})
export class DriverNotifications {
    notifications: Notification[] = [
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
        },
        {
            id: 4,
            type: 'warning',
            icon: 'bi-exclamation-circle',
            title: 'Tour Pending Completion',
            message: 'The "Northern Areas Explorer" tour is pending accommodation confirmation.',
            time: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'danger',
            icon: 'bi-x-circle',
            title: 'Tour Cancellation',
            message: 'The "Swat Valley Tour" scheduled for Jan 8 has been cancelled by the customer.',
            time: '3 days ago',
            read: true
        },
        {
            id: 6,
            type: 'primary',
            icon: 'bi-info-circle',
            title: 'New Tour Available',
            message: 'A new tour "Skardu & Deosai Plains Expedition" is now available. Apply before Jan 10.',
            time: '3 days ago',
            read: true
        },
        {
            id: 7,
            type: 'success',
            icon: 'bi-check-circle',
            title: 'Trip Completed',
            message: 'You have successfully completed "Nathia Gali Winter Tour". Please rate your experience.',
            time: '5 days ago',
            read: true
        },
        {
            id: 8,
            type: 'primary',
            icon: 'bi-bell',
            title: 'Rating Received',
            message: 'Ali Hassan rated you 5 stars for "Nathia Gali Winter Tour". Great job!',
            time: '5 days ago',
            read: true
        },
        {
            id: 9,
            type: 'success',
            icon: 'bi-currency-dollar',
            title: 'Payment Received',
            message: 'Rs. 7,500 payment for "Nathia Gali Winter Tour" has been credited.',
            time: '6 days ago',
            read: true
        }
    ];

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
            default: return 'text-primary bg-primary-subtle';
        }
    }
}
