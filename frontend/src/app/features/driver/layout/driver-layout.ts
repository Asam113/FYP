import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-driver-layout',
    imports: [CommonModule, RouterModule],
    templateUrl: './driver-layout.html',
    styleUrl: './driver-layout.css'
})
export class DriverLayout {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
