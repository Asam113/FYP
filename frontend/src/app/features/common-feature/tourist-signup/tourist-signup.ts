import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-tourist-signup',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './tourist-signup.html',
    styleUrl: './tourist-signup.css'
})
export class TouristSignup {

    fullName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';
    acceptedTerms = false;

    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private router: Router,
        private toastService: ToastService
    ) { }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    createAccount() {
        // Validate all fields
        if (!this.fullName || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
            this.toastService.show("Please fill in all fields", "error");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.toastService.show("Please enter a valid email address", "error");
            return;
        }

        // Password validation
        if (this.password.length < 8) {
            this.toastService.show("Password must be at least 8 characters long", "error");
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.toastService.show("Passwords do not match", "error");
            return;
        }

        // Save user data
        localStorage.setItem('touristEmail', this.email);
        localStorage.setItem('touristPassword', this.password);
        localStorage.setItem('touristFullName', this.fullName);
        localStorage.setItem('touristPhone', this.phoneNumber);
        localStorage.setItem('role', 'tourist');

        this.toastService.show("Account created successfully! Please verify your email.", "success");
        this.router.navigate(['/verify-otp']);
    }

    goBack() {
        this.router.navigate(['/role-selection']);
    }
}
