import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.css'
})
export class Settings {
    // Password Section
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';

    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;

    // Notification Preferences
    notifications = {
        offerSubmitted: true,
        offerApproved: true,
        offerRejected: true,
        orderFinalized: true,
        email: true,
        sms: false
    };

    togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
        if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
        if (field === 'new') this.showNewPassword = !this.showNewPassword;
        if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
    }

    updatePassword() {
        console.log('Update password clicked');
        // Implement password update logic
    }
}
