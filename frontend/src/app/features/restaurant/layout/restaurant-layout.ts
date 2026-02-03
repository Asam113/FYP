import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    standalone: true,
    selector: 'app-restaurant-layout',
    imports: [CommonModule, RouterModule],
    templateUrl: './restaurant-layout.html',
    styleUrl: './restaurant-layout.css'
})
export class RestaurantLayout implements OnInit {
    isSidebarOpen = false;
    user: any;
    unreadCount = 0;

    constructor(
        private authService: AuthService,
        private notificationService: NotificationService
    ) {
        this.user = this.authService.getUser();
    }

    ngOnInit() {
        this.loadUnreadCount();
        setInterval(() => this.loadUnreadCount(), 30000);
    }

    loadUnreadCount() {
        if (this.user && this.user.id) {
            this.notificationService.getUnreadCount(this.user.id).subscribe({
                next: (res) => this.unreadCount = res.count,
                error: (err) => console.error('Failed to load unread count', err)
            });
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.authService.logout();
    }
}
