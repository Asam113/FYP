import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-restaurant-layout',
    imports: [CommonModule, RouterModule],
    templateUrl: './restaurant-layout.html',
    styleUrl: './restaurant-layout.css'
})
export class RestaurantLayout {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
