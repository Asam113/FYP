import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  profile = {
    name: 'Royal Cuisine',
    role: 'Restaurant Partner',
    email: 'contact@royalcuisine.pk',
    phone: '+92 300 1234567',
    owner: 'Ahmad Khan',
    city: 'Islamabad',
    website: 'www.royalcuisine.pk',
    address: 'Plot 45, F-7 Markaz, Islamabad',
    cuisineTypes: 'Desi, BBQ, Fast Food',
    description: 'Premium catering services for tours and events. Specializing in traditional Pakistani cuisine with modern presentation.',
    stats: {
      established: '2015',
      dailyCapacity: '500 people per day',
      totalOrders: '156'
    }
  };

  // Edit Mode State
  isEditMode = false;
  editFormData: any = {};

  editProfile() {
    // Enable edit mode and clone data
    this.editFormData = JSON.parse(JSON.stringify(this.profile));
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editFormData = {};
  }

  saveProfile() {
    // Update the actual profile with the edited data
    this.profile = JSON.parse(JSON.stringify(this.editFormData));
    this.isEditMode = false;
    // In a real app, we would call a service here to update the backend
  }
}
