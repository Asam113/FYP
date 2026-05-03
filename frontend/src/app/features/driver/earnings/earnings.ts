import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

interface EarningRecord {
    earningId: number;
    tourTitle: string;
    amount: number;
    status: string;
    date: string;
    method: string;
}

interface EarningsSummary {
    totalEarned: number;
    pendingPayout: number;
    withdrawnAmount: number;
    transactions: EarningRecord[];
}

@Component({
    selector: 'app-driver-earnings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './earnings.html',
    styleUrl: './earnings.css'
})
export class Earnings implements OnInit {
    summary: EarningsSummary | null = null;
    isLoading = true;

    constructor(
        private http: HttpClient,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.fetchEarnings();
    }

    fetchEarnings(): void {
        this.isLoading = true;
        this.http.get<EarningsSummary>(`${environment.apiUrl}/api/earnings/my-earnings`)
            .subscribe({
                next: (res) => {
                    this.summary = res;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastService.show('Failed to load earnings data.', 'error');
                    this.isLoading = false;
                }
            });
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-success-subtle text-success';
            case 'processing': return 'bg-warning-subtle text-warning';
            case 'pending': return 'bg-info-subtle text-info';
            case 'cancelled': return 'bg-danger-subtle text-danger';
            default: return 'bg-secondary-subtle text-secondary';
        }
    }
}
