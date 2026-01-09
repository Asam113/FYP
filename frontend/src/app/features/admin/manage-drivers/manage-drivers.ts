import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Driver {
  id: string;
  name: string;
  contact: string;
  cnic: string;
  license: string;
  vehicle: string;
  verification: {
    documents: boolean;
    vehicle: boolean;
    background: boolean;
  };
  rating: number | null;
  totalTrips: number;
  status: 'Verified' | 'Pending' | 'New' | 'Rejected';
  avatar: string;
}

@Component({
  selector: 'app-manage-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-drivers.html',
  styleUrls: ['./manage-drivers.css']
})
export class ManageDrivers {
  searchTerm: string = '';
  activeTab: 'all' | 'verified' | 'pending' = 'all';

  drivers: Driver[] = [
    {
      id: 'D001',
      name: 'Ali Khan',
      contact: '+92 300 1234567',
      cnic: '42101-1234567-1',
      license: 'LHR-ABC-123',
      vehicle: 'Toyota Corolla',
      verification: { documents: true, vehicle: true, background: true },
      rating: 4.8,
      totalTrips: 45,
      status: 'Verified',
      avatar: 'https://ui-avatars.com/api/?name=Ali+Khan&background=random'
    },
    {
      id: 'D002',
      name: 'Ahmed Raza',
      contact: '+92 321 7654321',
      cnic: '42201-9876543-2',
      license: 'ISB-XYZ-789',
      vehicle: 'Honda Civic',
      verification: { documents: true, vehicle: true, background: true },
      rating: 4.9,
      totalTrips: 62,
      status: 'Verified',
      avatar: 'https://ui-avatars.com/api/?name=Ahmed+Raza&background=random'
    },
    {
      id: 'D003',
      name: 'Hassan Malik',
      contact: '+92 333 5555555',
      cnic: '42301-5555555-3',
      license: 'KHI-DEF-456',
      vehicle: 'Suzuki Alto',
      verification: { documents: true, vehicle: true, background: false },
      rating: 4.5,
      totalTrips: 28,
      status: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Hassan+Malik&background=random'
    },
    {
      id: 'D004',
      name: 'Bilal Ahmed',
      contact: '+92 345 0000000',
      cnic: '42401-8888888-4',
      license: 'MUL-GHI-000',
      vehicle: 'Toyota Vitz',
      verification: { documents: true, vehicle: false, background: false },
      rating: null,
      totalTrips: 0,
      status: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Bilal+Ahmed&background=random'
    }
  ];

  get filteredDrivers() {
    return this.drivers.filter(driver => {
      const matchesSearch =
        driver.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        driver.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(this.searchTerm.toLowerCase());

      if (this.activeTab === 'all') return matchesSearch;
      if (this.activeTab === 'verified') return matchesSearch && driver.status === 'Verified';
      if (this.activeTab === 'pending') return matchesSearch && (driver.status === 'Pending' || driver.status === 'New');

      return matchesSearch;
    });
  }

  setActiveTab(tab: 'all' | 'verified' | 'pending') {
    this.activeTab = tab;
  }

  showConfirmModal = false;
  confirmMessage = '';
  confirmType: 'approve' | 'reject' = 'approve';
  private confirmCallback: (() => void) | null = null;

  approveDriver(driver: Driver) {
    this.triggerConfirm(
      `Are you sure you want to approve ${driver.name}?`,
      'approve',
      () => {
        driver.status = 'Verified';
        driver.verification = { documents: true, vehicle: true, background: true };
      }
    );
  }

  rejectDriver(driver: Driver) {
    this.triggerConfirm(
      `Are you sure you want to reject ${driver.name}?`,
      'reject',
      () => {
        driver.status = 'Rejected';
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
