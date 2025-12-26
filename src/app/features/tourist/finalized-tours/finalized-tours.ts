import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-finalized-tours',
  imports: [CommonModule],
  templateUrl: './finalized-tours.html',
  styleUrl: './finalized-tours.css'
})
export class FinalizedTours {

  bookedTours = [
    {
      id: 1,
      title: 'Swat Valley Expedition',
      location: 'Swat, KPK',
      date: 'Dec 28, 2025 - Dec 30, 2025',
      status: 'Confirmed',
      price: 'Rs. 18,500',
      image: 'https://placehold.co/600x400/1e293b/FFF?text=Swat'
    },
    {
      id: 2,
      title: 'Lahore City Tour',
      location: 'Lahore, Punjab',
      date: 'Jan 05, 2026',
      status: 'Pending',
      price: 'Rs. 5,000',
      image: 'https://placehold.co/600x400/0d6efd/FFF?text=Lahore'
    },
    {
      id: 3,
      title: 'Fairy Meadows Trek',
      location: 'Gilgit Baltistan',
      date: 'Jun 15, 2026 - Jun 20, 2026',
      status: 'Completed',
      price: 'Rs. 45,000',
      image: 'https://placehold.co/600x400/198754/FFF?text=Fairy+Meadows'
    }
  ];

}
