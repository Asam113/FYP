import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    private apiUrl = 'http://localhost:5238/api/drivers';

    constructor(private http: HttpClient) { }

    getAllDrivers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    updateDriverStatus(driverId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${driverId}/status`, { status });
    }
}
