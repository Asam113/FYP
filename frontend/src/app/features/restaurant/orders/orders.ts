import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
    name: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
}

interface Order {
    tourName: string;
    approvalDate: string;
    tourDate: string;
    tourists: number;
    mealType: string;
    location: string;
    totalValue?: number;
    perPersonValue?: number;
    status: 'Confirmed';
    menuItems?: MenuItem[];
    isMenuVisible?: boolean;
}

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.html',
    styleUrl: './orders.css'
})
export class Orders {

    orders: Order[] = [
        {
            tourName: 'Lahore Heritage Tour',
            approvalDate: 'Jan 8, 2026',
            tourDate: 'Jan 18, 2026',
            tourists: 25,
            mealType: 'Lunch',
            location: 'Lahore',
            totalValue: 32000,
            perPersonValue: 1280,
            status: 'Confirmed',
            isMenuVisible: false,
            menuItems: [
                { name: 'Chicken Biryani', quantity: 25, pricePerUnit: 500, total: 12500 },
                { name: 'Raita', quantity: 25, pricePerUnit: 50, total: 1250 },
                { name: 'Salad', quantity: 25, pricePerUnit: 50, total: 1250 },
                { name: 'Cold Drink', quantity: 25, pricePerUnit: 100, total: 2500 },
                { name: 'Kheer', quantity: 25, pricePerUnit: 200, total: 5000 },
                { name: 'Seekh Kabab', quantity: 50, pricePerUnit: 150, total: 7500 },
                { name: 'Naan', quantity: 50, pricePerUnit: 40, total: 2000 }
            ]
        },
        {
            tourName: 'Islamabad City Tour',
            approvalDate: 'Jan 6, 2026',
            tourDate: 'Jan 12, 2026',
            tourists: 20,
            mealType: 'Lunch',
            location: 'Islamabad',
            totalValue: 28000,
            perPersonValue: 1400,
            status: 'Confirmed',
            isMenuVisible: true, // Shown open in screenshot
            menuItems: [
                { name: 'Grilled Chicken', quantity: 20, pricePerUnit: 500, total: 10000 },
                { name: 'French Fries', quantity: 20, pricePerUnit: 150, total: 3000 },
                { name: 'Coleslaw', quantity: 20, pricePerUnit: 100, total: 2000 },
                { name: 'Garlic Bread', quantity: 20, pricePerUnit: 200, total: 4000 },
                { name: 'Fresh Juice', quantity: 20, pricePerUnit: 180, total: 3600 },
                { name: 'Ice Cream', quantity: 20, pricePerUnit: 150, total: 3000 },
                { name: 'Dinner Roll', quantity: 20, pricePerUnit: 120, total: 2400 }
            ]
        },
        {
            tourName: 'Taxila Historical Tour',
            approvalDate: 'Jan 10, 2026',
            tourDate: 'Jan 22, 2026',
            tourists: 30,
            mealType: 'Lunch',
            location: 'Taxila',
            status: 'Confirmed',
            totalValue: 28000,
            perPersonValue: 933,
            isMenuVisible: false,
            menuItems: [
                { name: 'Grilled Chicken', quantity: 20, pricePerUnit: 500, total: 10000 },
                { name: 'French Fries', quantity: 20, pricePerUnit: 150, total: 3000 },
                { name: 'Coleslaw', quantity: 20, pricePerUnit: 100, total: 2000 },
                { name: 'Garlic Bread', quantity: 20, pricePerUnit: 200, total: 4000 },
                { name: 'Fresh Juice', quantity: 20, pricePerUnit: 180, total: 3600 },
                { name: 'Ice Cream', quantity: 20, pricePerUnit: 150, total: 3000 },
                { name: 'Sandwich', quantity: 20, pricePerUnit: 120, total: 2400 }
            ]
        }
    ];

    toggleMenu(order: Order) {
        order.isMenuVisible = !order.isMenuVisible;
    }

}
