import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-tourist-layout',
    imports: [RouterModule, CommonModule],
    templateUrl: './tourist-layout.html',
    styleUrl: './tourist-layout.css'
})
export class TouristLayout {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
