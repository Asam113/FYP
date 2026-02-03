import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {
    private apiUrl = `${environment.apiUrl}/api/restaurants`;

    constructor(private http: HttpClient) { }

    getRestaurant(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    uploadRestaurantImages(restaurantId: number, images: File[]): Observable<any> {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        return this.http.post(`${this.apiUrl}/${restaurantId}/images`, formData);
    }

    deleteRestaurantImage(imageId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/images/${imageId}`);
    }
}
