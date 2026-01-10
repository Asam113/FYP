import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-driver-signup',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './driver-signup.html',
    styleUrl: './driver-signup.css'
})
export class DriverSignup {

    fullName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';
    licenseNumber: string = '';
    cnic: string = '';
    vehicleType: string = '';
    vehicleRegNumber: string = '';

    vehicleTypes = ['Sedan', 'SUV', 'Van', 'Mini Bus', 'Bus'];

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
        console.log('Driver application submitted', {
            fullName: this.fullName,
            email: this.email,
            phone: this.phoneNumber,
            // ... other fields
        });
        alert('Application Submitted! Please verify your email.');
        this.router.navigate(['/verify-otp']);
    }
}
