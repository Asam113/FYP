import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RestaurantDto {
    restaurantId: number;
    restaurantName: string;
    ownerName?: string;
    businessType?: string;
    rating: number;
    applicationStatus: string;
    businessLicense?: string;
    address: string;
    postalCode?: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    createdAt: Date;
}

export interface RestaurantStatsDto {
    totalRestaurants: number;
    totalHotels: number;
    pendingVerification: number;
    restaurantGrowthThisMonth: number;
    hotelGrowthThisMonth: number;
}

export interface PaymentStatsDto {
    totalRevenue: number;
    pendingPayments: number;
    totalRefunded: number;
    failedAttempts: number;
}

export interface PaymentLedgerDto {
    id: string;
    type: string;
    description: string;
    amount: number;
    date: string;
    method: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/api/admin`;

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getRestaurants(): Observable<RestaurantDto[]> {
        return this.http.get<RestaurantDto[]>(`${this.apiUrl}/restaurants`, {
            headers: this.getAuthHeaders()
        });
    }

    getRestaurantStats(): Observable<RestaurantStatsDto> {
        return this.http.get<RestaurantStatsDto>(`${this.apiUrl}/restaurants/stats`, {
            headers: this.getAuthHeaders()
        });
    }

    approveRestaurant(id: number): Observable<RestaurantDto> {
        return this.http.put<RestaurantDto>(`${this.apiUrl}/restaurants/${id}/approve`, {}, {
            headers: this.getAuthHeaders()
        });
    }

    rejectRestaurant(id: number): Observable<RestaurantDto> {
        return this.http.put<RestaurantDto>(`${this.apiUrl}/restaurants/${id}/reject`, {}, {
            headers: this.getAuthHeaders()
        });
    }

    // --- Payment Management ---

    getPaymentStats(): Observable<PaymentStatsDto> {
        return this.http.get<PaymentStatsDto>(`${this.apiUrl}/payments/stats`, {
            headers: this.getAuthHeaders()
        });
    }

    getPaymentLedger(): Observable<PaymentLedgerDto[]> {
        return this.http.get<PaymentLedgerDto[]>(`${this.apiUrl}/payments/ledger`, {
            headers: this.getAuthHeaders()
        });
    }

    getAdminReports(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/reports/summary`, {
            headers: this.getAuthHeaders()
        });
    }
}
