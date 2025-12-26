import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Tour } from '../../../core/models/tour.interface';
import { TourService } from '../../../core/services/tour.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  tours: Tour[] = [];

  constructor(
    private tourService: TourService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tourService.getTours().subscribe({
      next: (data) => {
        this.tours = data;
      },
      error: (err) => console.error(err)
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/tourist/tour-details', id]);
  }

}
