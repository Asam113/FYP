import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DriverService } from '../../../core/services/driver.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

interface Driver {
  id: string;      // Display ID (e.g., D001)
  realId: number;  // Backend Int ID
  name: string;
  contact: string;
  cnic: string;
  license: string;
  vehicle: string;
  documents: {
    cnicFront: string;
    cnicBack: string;
    license: string;
  };
  rating: number | null;
  totalTrips: number;
  status: 'Verified' | 'Pending' | 'New' | 'Rejected';
  avatar: string;
}

@Component({
  selector: 'app-manage-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-drivers.html',
  styleUrls: ['./manage-drivers.css']
})
export class ManageDrivers implements OnInit {
  searchTerm: string = '';
  activeTab: 'all' | 'verified' | 'pending' | 'rejected' = 'all';
  drivers: Driver[] = [];

  constructor(private driverService: DriverService, private toastService: ToastService) { }

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data.map((d: any) => ({
          id: `D${d.driverId.toString().padStart(3, '0')}`,
          realId: d.driverId,
          name: d.name,
          contact: d.contact,
          cnic: d.cnic,
          license: d.license,
          vehicle: d.vehicle,
          documents: {
            cnicFront: d.documents.cnicFront ? `${environment.apiUrl}${d.documents.cnicFront}` : 'assets/images/placeholder_cnic_front.jpg',
            cnicBack: d.documents.cnicBack ? `${environment.apiUrl}${d.documents.cnicBack}` : 'assets/images/placeholder_cnic_back.jpg',
            license: d.documents.license ? `${environment.apiUrl}${d.documents.license}` : 'assets/images/placeholder_license.jpg',
          },
          rating: d.rating || null,
          totalTrips: d.totalTrips,
          status: d.accountStatus === 'Active' ? 'Verified' : d.accountStatus, // Map Backend 'Active' to Frontend 'Verified' if needed, or stick to Pending/Verified/Rejected
          avatar: d.avatar && d.avatar.startsWith('http') ? d.avatar : `${environment.apiUrl}${d.avatar}`
        }));
      },
      error: (err) => {
        console.error('Failed to load drivers', err);
        this.toastService.show('Failed to load drivers', 'error');
      }
    });
  }

  get filteredDrivers() {
    return this.drivers.filter(driver => {
      const matchesSearch =
        driver.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        driver.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        driver.cnic.includes(this.searchTerm);

      if (this.activeTab === 'all') return matchesSearch;

      // Handle the mapping: 'Verified' in UI might verify against 'Active' or 'Verified' in backend
      const status = driver.status.toLowerCase();
      if (this.activeTab === 'verified') return matchesSearch && (status === 'verified' || status === 'active');
      return matchesSearch && status === this.activeTab;
    });
  }

  setActiveTab(tab: 'all' | 'verified' | 'pending' | 'rejected') {
    this.activeTab = tab;
  }

  // Document Modal logic
  showDocumentModal = false;
  selectedDriver: Driver | null = null;

  viewDocuments(driver: Driver) {
    this.selectedDriver = driver;
    this.showDocumentModal = true;
  }

  closeDocumentModal() {
    this.showDocumentModal = false;
    this.selectedDriver = null;
  }

  // Confirmation Modal logic
  showConfirmModal = false;
  confirmMessage = '';
  confirmType: 'approve' | 'reject' = 'approve';
  private confirmCallback: (() => void) | null = null;

  approveDriver(driver: Driver) {
    this.triggerConfirm(
      `Are you sure you want to approve ${driver.name}?`,
      'approve',
      () => {
        this.driverService.updateDriverStatus(driver.realId, 'Verified').subscribe({
          next: () => {
            driver.status = 'Verified';
            this.toastService.show(`Driver ${driver.name} approved successfully`, 'success');
          },
          error: () => this.toastService.show('Failed to approve driver', 'error')
        });
      }
    );
  }

  rejectDriver(driver: Driver) {
    this.triggerConfirm(
      `Are you sure you want to reject ${driver.name}?`,
      'reject',
      () => {
        this.driverService.updateDriverStatus(driver.realId, 'Rejected').subscribe({
          next: () => {
            driver.status = 'Rejected';
            this.toastService.show(`Driver ${driver.name} rejected`, 'success');
          },
          error: () => this.toastService.show('Failed to reject driver', 'error')
        });
      }
    );
  }

  triggerConfirm(message: string, type: 'approve' | 'reject', callback: () => void) {
    this.confirmMessage = message;
    this.confirmType = type;
    this.confirmCallback = callback;
    this.showConfirmModal = true;
  }

  onConfirm() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.closeModal();
  }

  closeModal() {
    this.showConfirmModal = false;
    this.confirmCallback = null;
  }
}
