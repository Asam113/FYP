import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: 'Tourist' | 'Driver' | 'Restaurant';
    dateOfBirth?: string;
    cnic?: string;
    nationality?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        phoneNumber?: string;
        role: string;
        roleSpecificId?: number;
        profilePicture?: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5238/api/auth';

    constructor(private http: HttpClient) { }

    signup(request: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request);
    }

    signupDriver(formData: FormData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup/driver`, formData);
    }

    initiateDriverSignup(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/initiate-driver-signup`, data);
    }

    signupTourist(formData: FormData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup/tourist`, formData);
    }

    signupRestaurant(formData: FormData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup/restaurant`, formData);
    }

    initiateRestaurantSignup(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/initiate-restaurant-signup`, data);
    }

    verifyOtp(email: string, otpCode: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/verify-otp`, { email, otpCode }).pipe(
            tap(response => {
                // Store token in localStorage upon successful verification
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
