import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { VerifyOtp } from '../verify-otp/verify-otp';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
    selector: 'app-restaurant-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, VerifyOtp, ImageUploaderComponent],
    templateUrl: './restaurant-signup.html',
    styleUrl: './restaurant-signup.css'
})
export class RestaurantSignup {

    // Phase 1: Personal & Logo
    ownerName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';
    profilePicture: File | null = null; // Restaurant Logo

    // Phase 3: Restaurant Info
    restaurantName: string = '';
    address: string = '';
    postalCode: string = '';
    businessType: string = ''; // Phase 2: Business Type
    businessLicenseFile: File | null = null;

    businessTypes = [
        { value: 'Restaurant', label: 'Restaurant (Meals Only)', icon: '🍽️' },
        { value: 'Hotel', label: 'Hotel (Rooms + Meals)', icon: '🏨' },
        { value: 'GuestHouse', label: 'Guest House (Rooms Only)', icon: '🏠' }
    ];

    showPassword = false;
    showConfirmPassword = false;
    selectedRestaurantImages: File[] = [];

    currentStep = 1;

    steps = [
        { number: 1, name: 'Personal Info' },
        { number: 2, name: 'Verification' },
        { number: 3, name: 'Business Details' }
    ];


    constructor(
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    // --- Navigation & Flow ---

    goBack() {
        if (this.currentStep === 1) {
            this.router.navigate(['/role-selection']);
        } else {
            this.currentStep--;
        }
    }

    nextStep() {
        if (this.currentStep === 1) {
            this.validateAndInitiateSignup();
        } else if (this.currentStep === 2) {
            // Handled by VerifyOtp Component event
        } else if (this.currentStep === 3) {
            this.validateRestaurantDetailsAndSubmit();
        }
    }

    // --- Phase 1 Logic ---

    validateAndInitiateSignup() {
        if (!this.ownerName || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
            this.toastService.show('Please fill in all personal details', 'error');
            return;
        }

        if (!this.restaurantName || !this.businessType) {
            this.toastService.show('Please provide business name and type', 'error');
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.toastService.show('Passwords do not match', 'error');
            return;
        }

        const data = {
            name: this.ownerName,
            email: this.email,
            password: this.password,
            phoneNumber: this.phoneNumber,
            businessName: this.restaurantName,
            businessType: this.businessType
        };

        this.authService.initiateRestaurantSignup(data).subscribe({
            next: (res) => {
                this.toastService.show('OTP sent to your email', 'success');
                this.currentStep++;
            },
            error: (err) => {
                this.toastService.show(err.error?.message || 'Signup initialization failed', 'error');
            }
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onLogoSelected(event: any) {
        this.profilePicture = event.target.files[0];
    }

    // --- Phase 2 Logic (OTP) ---

    onOtpVerified() {
        // Called when VerifyOtp component emits success
        this.currentStep++;
    }

    // --- Phase 3 Logic (Details) ---

    onLicenseSelected(event: any) {
        this.businessLicenseFile = event.target.files[0];
    }

    onImagesSelected(files: File[]) {
        this.selectedRestaurantImages = files;
    }

    validateRestaurantDetailsAndSubmit() {
        if (!this.address || !this.postalCode) {
            this.toastService.show('Please fill in all business details', 'error');
            return;
        }

        if (!this.businessLicenseFile) {
            this.toastService.show('Please upload business license', 'error');
            return;
        }

        this.submitApplication();
    }

    submitApplication() {
        const formData = new FormData();
        formData.append('Name', this.ownerName);
        formData.append('Email', this.email);
        formData.append('Password', this.password);
        formData.append('PhoneNumber', this.phoneNumber);

        formData.append('RestaurantName', this.restaurantName);
        formData.append('Address', this.address);
        formData.append('BusinessType', this.businessType);
        formData.append('PostalCode', this.postalCode);
        formData.append('OwnerName', this.ownerName);

        if (this.profilePicture) {
            formData.append('ProfilePicture', this.profilePicture);
        }

        if (this.businessLicenseFile) {
            formData.append('LicenseDocument', this.businessLicenseFile);
        }

        // Restaurant Images
        this.selectedRestaurantImages.forEach(image => {
            formData.append('RestaurantImages', image);
        });

        console.log('Submitting application...');
        this.authService.signupRestaurant(formData).subscribe({
            next: (res) => {
                this.toastService.show('Restaurant Application Submitted Successfully!', 'success');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Signup Error Details:', err);
                if (err.error && err.error.errors) {
                    // Log validation errors specifically
                    console.table(err.error.errors);
                }
                this.toastService.show(err.error?.message || 'Submission failed', 'error');
            }
        });
    }
}
