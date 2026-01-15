import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-verify-otp',
    imports: [CommonModule, FormsModule],
    templateUrl: './verify-otp.html',
    styleUrl: './verify-otp.css'
})
export class VerifyOtp implements OnInit {
    @Input() email: string = '';
    @Input() redirectOnSuccess: boolean = true;
    @Output() verified = new EventEmitter<void>();

    otpCode: string = '';
    isLoading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        if (!this.email) {
            this.route.queryParams.subscribe(params => {
                this.email = params['email'];
                if (!this.email) {
                    this.toastService.show("Email not found. Please signup again.", "error");
                    this.router.navigate(['/role-selection']);
                }
            });
        }
    }

    verifyOtp() {
        if (!this.otpCode || this.otpCode.length < 6) {
            this.toastService.show("Please enter a valid 6-digit OTP", "error");
            return;
        }

        this.isLoading = true;
        this.authService.verifyOtp(this.email, this.otpCode).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.toastService.show("Account verified successfully!", "success");

                this.verified.emit();

                if (this.redirectOnSuccess) {
                    this.router.navigate(['/tourist']); // Default fallback or based on role
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Verification failed', error);
                this.toastService.show(error.error?.message || "Verification failed", "error");
            }
        });
    }
}
