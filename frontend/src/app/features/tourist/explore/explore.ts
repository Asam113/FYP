import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourService } from '../../../core/services/tour.service';
import { Tour } from '../../../core/models/tour.interface';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore {
  tours: Tour[] = [];

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.tourService.getTours().subscribe({
      next: (tours) => {
        // Only show finalized tours to tourists
        this.tours = tours.filter(tour => tour.status === 'Finalized');
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
      }
    });
  }
}
