import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-driver-signup',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './driver-signup.html',
    styleUrl: './driver-signup.css'
})
export class DriverSignup {

    currentStep = 1;
    steps = [
        { number: 1, name: 'Personal Info' },
        { number: 2, name: 'Verification' },
        { number: 3, name: 'Documents' },
        { number: 4, name: 'Vehicle Info' }
    ];

    fullName: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
    confirmPassword: string = '';

    // Phase 1 only requires these, others will be used in later phases
    profilePicture: File | null = null;

    // Placeholders for future phases
    licenseNumber: string = '';
    cnic: string = '';
    vehicleType: string = '';
    vehicleRegNumber: string = '';
    licenseExpiryDate: string = '';
    vehicleExpiryDate: string = '';
    vehicleTypes = ['Sedan', 'SUV', 'Van', 'Mini Bus', 'Bus'];

    showPassword = false;
    showConfirmPassword = false;

    licenseFile: File | null = null;
    cnicFrontFile: File | null = null;
    cnicBackFile: File | null = null;

    constructor(
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    goBack() {
        this.router.navigate(['/role-selection']);
    }

    // Step 1: Toggles
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    // Step 2: OTP
    otpCode: string = '';

    // Step 3: Documents
    onFileSelected(event: any, type: string) {
        const file = event.target.files[0];
        if (file) {
            switch (type) {
                case 'profile':
                    this.profilePicture = file;
                    break;
                case 'license':
                    this.licenseFile = file;
                    break;
                case 'cnicFront':
                    this.cnicFrontFile = file;
                    break;
                case 'cnicBack':
                    this.cnicBackFile = file;
                    break;
            }
        }
    }

    // Step 4: Vehicle Info
    vehicleModel: string = '';
    vehicleCapacity: string = '';

    // Navigation
    nextStep() {
        if (this.currentStep === 1) {
            if (!this.fullName || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
                this.toastService.show('Please fill in all fields', 'error');
                return;
            }
            if (this.password !== this.confirmPassword) {
                this.toastService.show('Passwords do not match', 'error');
                return;
            }

            // Call Backend to Initiate Signup (Send OTP)
            const initiateData = {
                name: this.fullName,
                email: this.email,
                password: this.password,
                phoneNumber: this.phoneNumber
            };

            this.authService.initiateDriverSignup(initiateData).subscribe({
                next: (res) => {
                    console.log('Initiated', res);
                    this.toastService.show('OTP sent to your email', 'success');
                    this.currentStep++;
                },
                error: (err) => {
                    console.error(err);
                    this.toastService.show(err.error?.message || 'Failed to initiate signup', 'error');
                }
            });

        } else if (this.currentStep === 2) {
            // Verify OTP
            if (!this.otpCode || this.otpCode.length < 6) {
                this.toastService.show('Please enter a valid 6-digit code', 'error');
                return;
            }

            this.authService.verifyOtp(this.email, this.otpCode).subscribe({
                next: (res) => {
                    console.log('Verified', res);
                    this.toastService.show('Email verified successfully', 'success');
                    // OTP Verification successful, move to next step
                    this.currentStep++;
                },
                error: (err) => {
                    console.error(err);
                    this.toastService.show(err.error?.message || 'Invalid OTP', 'error');
                }
            });

        } else if (this.currentStep === 3) {
            if (!this.licenseNumber || !this.cnic || !this.licenseExpiryDate) {
                this.toastService.show('Please fill in all document details including expiry date', 'error');
                return;
            }
            if (!this.licenseFile || !this.cnicFrontFile || !this.cnicBackFile) {
                this.toastService.show('Please upload all required documents', 'error');
                return;
            }
            this.currentStep++;
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }



    submitApplication() {
        console.log('Submitting application...');

        // Final Client-side validation
        if (!this.vehicleRegNumber || !this.vehicleType || !this.vehicleModel || !this.vehicleCapacity) {
            this.toastService.show('Please fill in all vehicle details', 'error');
            return;
        }

        const formData = new FormData();

        // Personal Info (Already verified but needed for DTO if backend expects it to update/match)
        formData.append('name', this.fullName);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('phoneNumber', this.phoneNumber);

        // Document Info
        formData.append('cnic', this.cnic);
        formData.append('licence', this.licenseNumber);
        formData.append('licenceExpiryDate', this.licenseExpiryDate);

        // Files
        if (this.profilePicture) formData.append('profilePicture', this.profilePicture);
        if (this.cnicFrontFile) formData.append('cnicFront', this.cnicFrontFile);
        if (this.cnicBackFile) formData.append('cnicBack', this.cnicBackFile);
        if (this.licenseFile) formData.append('licenceImage', this.licenseFile);

        // Vehicle Info
        formData.append('vehicleRegNumber', this.vehicleRegNumber);
        formData.append('vehicleType', this.vehicleType);
        formData.append('vehicleModel', this.vehicleModel);
        formData.append('vehicleCapacity', this.vehicleCapacity.toString());

        this.authService.signupDriver(formData).subscribe({
            next: (response) => {
                console.log('Signup Successful', response);
                this.toastService.show('Application Submitted Successfully!', 'success');
                this.router.navigate(['/login']); // or dashboard
            },
            error: (error) => {
                console.error('Signup Failed', error);
                this.toastService.show(error.error?.message || 'Signup failed', 'error');
            }
        });
    }
}
