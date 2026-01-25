import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface Vehicle {
    vehicleId?: number;
    driverId: number;
    registrationNumber: string;
    vehicleType: string;
    model: string;
    capacity: number;
    status: string;
}

@Component({
    selector: 'app-vehicles',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './vehicles.html',
    styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit {
    vehicles: Vehicle[] = [];
    isLoading = true;
    showAddModal = false;

    // New Vehicle Form
    newVehicle: Partial<Vehicle> = {
        registrationNumber: '',
        vehicleType: '',
        model: '',
        capacity: undefined,
        status: 'Active'
    };

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadVehicles();
    }

    loadVehicles(): void {
        const user = this.authService.getUser();
        if (!user || !user.roleSpecificId) {
            this.toastService.show('User session not found', 'error');
            return;
        }

        this.isLoading = true;
        this.http.get<Vehicle[]>(`http://localhost:5238/api/vehicles/driver/${user.roleSpecificId}`)
            .subscribe({
                next: (data) => {
                    this.vehicles = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error loading vehicles:', err);
                    this.toastService.show('Failed to load vehicles', 'error');
                    this.isLoading = false;
                }
            });
    }

    openAddModal(): void {
        this.showAddModal = true;
        this.newVehicle = {
            registrationNumber: '',
            vehicleType: '',
            model: '',
            capacity: undefined,
            status: 'Active'
        };
    }

    closeAddModal(): void {
        this.showAddModal = false;
    }

    addVehicle(): void {
        const user = this.authService.getUser();
        if (!user || !user.roleSpecificId) return;

        if (!this.newVehicle.registrationNumber || !this.newVehicle.vehicleType || !this.newVehicle.capacity) {
            this.toastService.show('Please fill in all required fields', 'warning');
            return;
        }

        const payload = {
            ...this.newVehicle,
            driverId: user.roleSpecificId
        };

        // Note: I need to ensure the backend supports POST to api/vehicles. 
        // If not, I'll need to add it to VehiclesController.
        this.http.post('http://localhost:5238/api/vehicles', payload)
            .subscribe({
                next: (res) => {
                    this.toastService.show('Vehicle added successfully', 'success');
                    this.loadVehicles();
                    this.closeAddModal();
                },
                error: (err) => {
                    console.error('Error adding vehicle:', err);
                    this.toastService.show('Failed to add vehicle', 'error');
                }
            });
    }

    deleteVehicle(id?: number): void {
        if (!id) return;

        if (confirm('Are you sure you want to remove this vehicle?')) {
            this.http.delete(`http://localhost:5238/api/vehicles/${id}`)
                .subscribe({
                    next: () => {
                        this.toastService.show('Vehicle removed successfully', 'success');
                        this.loadVehicles();
                    },
                    error: (err) => {
                        console.error('Error deleting vehicle:', err);
                        this.toastService.show('Failed to remove vehicle', 'error');
                    }
                });
        }
    }

    getVehicleIcon(type: string): string {
        const t = type.toLowerCase();
        if (t.includes('car')) return 'bi-car-front-fill';
        if (t.includes('bus') || t.includes('coaster')) return 'bi-bus-front-fill';
        if (t.includes('van') || t.includes('hiace')) return 'bi-truck-flatbed';
        return 'bi-truck';
    }
}
