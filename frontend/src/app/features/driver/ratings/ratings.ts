import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-ratings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ratings.html',
    styleUrl: './ratings.css'
})
export class Ratings {

    overallRating = 4.8;
    totalReviews = 24;
    ratingTrend = '+0.3 this month';

    ratingBreakdown = [
        { stars: 5, count: 18, percentage: 75 },
        { stars: 4, count: 4, percentage: 16 },
        { stars: 3, count: 1, percentage: 4 },
        { stars: 2, count: 1, percentage: 4 },
        { stars: 1, count: 0, percentage: 0 }
    ];

    reviews = [
        {
            name: 'Ali Hassan',
            rating: 5,
            date: 'Dec 28, 2025',
            tourName: 'Nathia Gali Winter Tour',
            comment: 'Excellent driver! Very professional and punctual. Made our trip memorable with great driving skills and local knowledge.',
            helpfulCount: 12
        },
        {
            name: 'Sara Ahmed',
            rating: 4.8,
            date: 'Dec 20, 2025',
            tourName: 'Karachi City Tour',
            comment: 'Great experience overall. The driver was friendly and knew all the best routes. Highly recommend!',
            helpfulCount: 8
        },
        {
            name: 'Muhammad Imran',
            rating: 4.9,
            date: 'Dec 15, 2025',
            tourName: 'Khewra Salt Mines Tour',
            comment: 'Very knowledgeable about the routes and local attractions. Safe driving and comfortable journey.',
            helpfulCount: 10
        },
        {
            name: 'Fatima Khan',
            rating: 5,
            date: 'Dec 5, 2025',
            tourName: 'Kalar Kahar Tour',
            comment: 'Amazing driver! Will definitely book again. Professional behavior and excellent service.',
            helpfulCount: 15
        },
        {
            name: 'Ayesha Malik',
            rating: 4.6,
            date: 'Nov 28, 2025',
            tourName: 'Margalla Hills Trail',
            comment: 'Punctual and friendly driver. Made the journey comfortable and enjoyable.',
            helpfulCount: 7
        }
    ];

    strengths = [
        { name: 'Professionalism', percentage: 95 },
        { name: 'Punctuality', percentage: 92 },
        { name: 'Local Knowledge', percentage: 88 },
        { name: 'Vehicle Condition', percentage: 90 }
    ];

}
