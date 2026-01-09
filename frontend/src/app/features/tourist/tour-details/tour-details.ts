import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Tour } from '../../../core/models/tour.interface';
import { TourService } from '../../../core/services/tour.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tour-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './tour-details.html',
    styleUrls: ['./tour-details.css']
})
export class TourDetailsComponent implements OnInit {

    tour: Tour | undefined;
    isLoading: boolean = true;
    seatsRemaining: number = 0;

    constructor(
        private route: ActivatedRoute,
        private tourService: TourService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.tourService.getTourById(id).subscribe({
                next: (data) => {
                    this.tour = data;
                    if (this.tour) {
                        this.seatsRemaining = this.tour.totalSeats - this.tour.seatsBooked;
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error("Error fetching tour", err);
                    this.isLoading = false;
                }
            });
        } else {
            this.isLoading = false;
        }
    }

}
