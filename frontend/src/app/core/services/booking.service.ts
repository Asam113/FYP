import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private apiUrl = `${environment.apiUrl}/api/bookings`;

    constructor(private http: HttpClient) { }

    createBooking(booking: any): Observable<any> {
        return this.http.post(this.apiUrl, booking);
    }

    getTouristBookings(touristId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tourist/${touristId}`);
    }
}
