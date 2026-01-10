import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-restaurant-signup',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './restaurant-signup.html',
    styleUrl: './restaurant-signup.css'
})
export class RestaurantSignup {

    restaurantName: string = '';
    ownerName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';
    address: string = '';

    showPassword = false;
    showConfirmPassword = false;

    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/role-selection']);
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    submitApplication() {
        if (this.password !== this.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // TODO: Implement actual registration logic
        console.log('Restaurant application submitted', {
            restaurantName: this.restaurantName,
            ownerName: this.ownerName,
            email: this.email,
            // ... other fields
        });
        alert('Application Submitted! Please verify your email.');
        this.router.navigate(['/verify-otp']);
    }
}
