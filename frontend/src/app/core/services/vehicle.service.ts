import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private apiUrl = 'http://localhost:5238/api/vehicles';

    constructor(private http: HttpClient) { }

    updateVehicleStatus(vehicleId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${vehicleId}/status`, { status });
    }
}
