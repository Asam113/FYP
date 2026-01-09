import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Partner {
  id: number;
  name: string;
  type: 'Hotel' | 'Restaurant';
  status: 'Verified' | 'Pending';
  location: string;
  rating: number;
  phone: string;
  email: string;
  capacity: string;
  specialOffer: string;
  imageUrl: string;
}

@Component({
  selector: 'app-manage-restaurants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-restaurants.html',
  styleUrl: './manage-restaurants.css'
})
export class ManageRestaurants {
  stats = {
    totalHotels: 78,
    hotelGrowth: 5,
    totalRestaurants: 65,
    restaurantGrowth: 8,
    pending: 12
  };

  partners: Partner[] = [
    {
      id: 1,
      name: 'Pearl Continental Hotel',
      type: 'Hotel',
      status: 'Verified',
      location: 'Lahore',
      rating: 4.9,
      phone: '+92 42 111 505 505',
      email: 'info@pchotels.com',
      capacity: '425 Rooms Available',
      specialOffer: '15% discount for tour groups',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/FFF?text=Pearl+Continental'
    },
    {
      id: 2,
      name: 'Monal Restaurant',
      type: 'Restaurant',
      status: 'Verified',
      location: 'Islamabad',
      rating: 4.7,
      phone: '+92 51 2278258',
      email: 'reservations@monal.pk',
      capacity: 'Capacity: 250 guests',
      specialOffer: 'Special tour group menu at PKR 1,500/person',
      imageUrl: 'https://placehold.co/600x400/f1f3f5/333?text=Monal+Restaurant'
    },
    {
      id: 3,
      name: 'Serena Hotel Swat',
      type: 'Hotel',
      status: 'Verified',
      location: 'Swat Valley',
      rating: 4.8,
      phone: '+92 946 9230261',
      email: 'swat@serena.com.pk',
      capacity: '32 Rooms Available',
      specialOffer: 'Complimentary breakfast for groups 10+',
      imageUrl: 'https://placehold.co/600x400/2c3e50/FFF?text=Serena+Hotel'
    },
    {
      id: 4,
      name: 'Savour Foods',
      type: 'Restaurant',
      status: 'Pending',
      location: 'Islamabad',
      rating: 4.5,
      phone: '+92 51 4863888',
      email: 'contact@savourfoods.com',
      capacity: 'Capacity: 180 guests',
      specialOffer: '10% group discount, catering available',
      imageUrl: 'https://placehold.co/600x400/e74c3c/FFF?text=Savour+Foods'
    }
  ];

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
}
