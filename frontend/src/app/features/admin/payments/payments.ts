import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, PaymentLedgerDto, PaymentStatsDto } from '../../../core/services/admin.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {
  isLoading = true;
  error: string | null = null;
  
  // --- Payment Summary Stats ---
  summaryCards: any[] = [];
  transactions: PaymentLedgerDto[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchPaymentData();
  }

  fetchPaymentData(): void {
    this.isLoading = true;
    this.adminService.getPaymentStats().subscribe({
      next: (stats: PaymentStatsDto) => {
        this.updateSummaryCards(stats);
        this.fetchLedger();
      },
      error: (err) => {
        this.error = "Failed to load payment statistics.";
        this.isLoading = false;
      }
    });
  }

  fetchLedger(): void {
    this.adminService.getPaymentLedger().subscribe({
      next: (data: PaymentLedgerDto[]) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Failed to load transaction history.";
        this.isLoading = false;
      }
    });
  }

  private updateSummaryCards(stats: PaymentStatsDto): void {
    this.summaryCards = [
      {
        title: 'Total Revenue',
        amount: this.formatCurrency(stats.totalRevenue),
        note: 'Processed & Completed',
        icon: 'bi-check-circle-fill',
        bg: 'bg-teal'
      },
      {
        title: 'Pending Payments',
        amount: this.formatCurrency(stats.pendingPayments),
        note: 'Awaiting confirmation',
        icon: 'bi-hourglass-split',
        bg: 'bg-orange'
      },
      {
        title: 'Total Refunded',
        amount: this.formatCurrency(stats.totalRefunded),
        note: 'Sent back to tourists',
        icon: 'bi-arrow-counterclockwise',
        bg: 'bg-blue'
      },
      {
        title: 'Failed Attempts',
        amount: this.formatCurrency(stats.failedAttempts),
        note: 'Declined or cancelled',
        icon: 'bi-x-circle-fill',
        bg: 'bg-red'
      }
    ];
  }

  formatCurrency(value: number): string {
    return 'PKR ' + (value || 0).toLocaleString();
  }
}
