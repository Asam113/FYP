import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore {
  tours = [
    {
      title: 'Northern Paradise Tour',
      route: 'Islamabad → Hunza Valley',
      duration: '7 Days',
      maxPeople: 15,
      rating: 4.8,
      reviews: 124,
      price: 45000,
      image: 'https://placehold.co/600x400/10b981/FFF?text=Northern+areas', // Greenish placeholder
      status: 'Available'
    },
    {
      title: 'Desert Safari Adventure',
      route: 'Bahawalpur → Cholistan Desert',
      duration: '3 Days',
      maxPeople: 20,
      rating: 4.6,
      reviews: 89,
      price: 22000,
      image: 'https://placehold.co/600x400/fbbf24/333?text=Desert+Safari', // Yellowish placeholder
      status: 'Available'
    },
    {
      title: 'Cultural Heritage Experience',
      route: 'Karachi → Lahore & Multan',
      duration: '5 Days',
      maxPeople: 12,
      rating: 4.9,
      reviews: 156,
      price: 35000,
      image: 'https://placehold.co/600x400/f43f5e/FFF?text=Heritage', // Reddish
      status: 'Available'
    },
    {
      title: 'Coastal Paradise Getaway',
      route: 'Karachi → Gwadar & Kund Malir',
      duration: '4 Days',
      maxPeople: 18,
      rating: 4.7,
      reviews: 92,
      price: 28000,
      image: 'https://placehold.co/600x400/3b82f6/FFF?text=Coastal', // Blue
      status: 'Limited Spots'
    },
    {
      title: 'Historic Forts Expedition',
      route: 'Lahore → Rohtas & Derawar',
      duration: '3 Days',
      maxPeople: 16,
      rating: 4.5,
      reviews: 67,
      price: 18000,
      image: 'https://placehold.co/600x400/8b5cf6/FFF?text=Forts', // Purple
      status: 'Available'
    },
    {
      title: 'Mountain Adventure Trek',
      route: 'Islamabad → Skardu & K2 Base Camp',
      duration: '10 Days',
      maxPeople: 10,
      rating: 4.9,
      reviews: 203,
      price: 65000,
      image: 'https://placehold.co/600x400/64748b/FFF?text=Mountains', // Grey
      status: 'Available'
    }
  ];
}
