import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-admin-layout',
    imports: [RouterModule, CommonModule],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css'
})
export class AdminLayout {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
