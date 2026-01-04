import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-finalized-tours',
  imports: [CommonModule],
  templateUrl: './finalized-tours.html',
  styleUrl: './finalized-tours.css'
})
export class FinalizedTours {

  activeTab: 'confirmed' | 'pending' = 'confirmed';

  confirmedTours = [
    {
      id: 1,
      title: 'Murree Hill Station Tour',
      status: 'Confirmed',
      route: 'Islamabad → Murree → Ayubia',
      date: 'Jan 10, 2026',
      duration: '2 Days',
      requirementsStatus: 'All requirements completed • Tour finalized',
      requirementsStatusClass: 'success',
      participants: 6,
      price: 'Rs. 8,500'
    },
    {
      id: 2,
      title: 'Lahore Heritage Tour',
      status: 'Confirmed',
      route: 'Lahore → Badshahi Mosque → Lahore Fort',
      date: 'Jan 20, 2026',
      duration: '1 Day',
      requirementsStatus: 'All requirements completed • Tour finalized',
      requirementsStatusClass: 'success',
      participants: 4,
      price: 'Rs. 6,000'
    },
    {
      id: 3,
      title: 'Taxila Historical Tour',
      status: 'Confirmed',
      route: 'Islamabad → Taxila → Khanpur',
      date: 'Feb 5, 2026',
      duration: '1 Day',
      requirementsStatus: 'All requirements completed • Tour finalized',
      requirementsStatusClass: 'success',
      participants: 5,
      price: 'Rs. 5,500'
    }
  ];

  pendingTours = [
    {
      id: 4,
      title: 'Northern Areas Explorer',
      status: 'Pending Completion',
      route: 'Islamabad → Hunza → Gilgit',
      date: 'Jan 15, 2026',
      duration: '6 Days',
      requirementsStatus: 'Driver accepted • Awaiting accommodation confirmation',
      requirementsStatusClass: 'warning',
      participants: 12,
      price: 'Rs. 25,000'
    },
    {
      id: 5,
      title: 'Neelum Valley Tour',
      status: 'Pending Completion',
      route: 'Muzaffarabad → Neelum Valley',
      date: 'Jan 28, 2026',
      duration: '4 Days',
      requirementsStatus: 'Driver accepted • 1 more driver needed',
      requirementsStatusClass: 'warning',
      participants: 8,
      price: 'Rs. 18,000'
    }
  ];

  setActiveTab(tab: 'confirmed' | 'pending') {
    this.activeTab = tab;
  }
}
