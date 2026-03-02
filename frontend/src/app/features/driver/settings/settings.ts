import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-driver-settings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './settings.html'
})
export class DriverSettings implements OnInit {
    isStripeConnected = false;
    isConnecting = false;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        const user = this.authService.getUser();
        if (user?.roleSpecificId) {
            this.http.get<any>(`${environment.apiUrl}/api/drivers/${user.roleSpecificId}`)
                .subscribe({
                    next: (driver) => {
                        this.isStripeConnected = !!driver?.stripeAccountId;
                    },
                    error: () => { }
                });
        }
    }

    connectStripe(): void {
        const user = this.authService.getUser();
        if (!user?.roleSpecificId) return;

        this.isConnecting = true;
        const body = {
            returnUrl: `${window.location.origin}/driver/settings`,
            refreshUrl: `${window.location.origin}/driver/settings`
        };

        this.http.post<{ url: string }>(
            `${environment.apiUrl}/api/drivers/${user.roleSpecificId}/onboarding-link`,
            body
        ).subscribe({
            next: (res) => {
                window.location.href = res.url;
            },
            error: (err) => {
                console.error('Onboarding error:', err);
                this.toastService.show('Failed to connect Stripe. Please try again.', 'error');
                this.isConnecting = false;
            }
        });
    }
}
