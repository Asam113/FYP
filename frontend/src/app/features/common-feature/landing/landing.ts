import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  carouselImages = [
    {
      url: '/assets/images/hunza.avif',
      title: 'Majestic Hunza Valley',
      desc: 'Experience the peak of serenity and culture.'
    },
    {
      url: '/assets/images/skardu.avif',
      title: 'Breathtaking Skardu',
      desc: 'Discover the cold desert and turquoise lakes.'
    },
    {
      url: '/assets/images/lake.avif',
      title: 'Crystal Clear Lakes',
      desc: 'Nature untouched, beauty unparalleled.'
    },
    {
      url: '/assets/images/north pak.avif',
      title: 'The Great North',
      desc: 'Your gateway to the roof of the world.'
    }
  ];

  roles = [
    {
      title: 'Tourists',
      icon: 'bi-compass-fill',
      description: 'Explore curated tours, book instantly, and create memories that last a lifetime.',
      color: 'primary'
    },
    {
      title: 'Drivers',
      icon: 'bi-car-front-fill',
      description: 'Join our professional network, manage your own schedule, and grow your earnings.',
      color: 'info'
    },
    {
      title: 'Partners',
      icon: 'bi-shop',
      description: 'Showcase your restaurant or hotel to travelers worldwide and manage orders seamlessly.',
      color: 'success'
    }
  ];
}
