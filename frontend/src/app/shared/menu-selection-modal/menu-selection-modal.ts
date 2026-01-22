import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MenuItem {
    itemId: number;
    itemName: string;
    price: number;
    description?: string;
    selected: boolean;
    quantity: number;
}

@Component({
    selector: 'app-menu-selection-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal fade show d-block" *ngIf="isVisible" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Select Menu Items</h5>
              <p class="text-muted mb-0">{{ restaurantName }} - {{ offerType }}</p>
            </div>
            <button type="button" class="btn-close" (click)="close()"></button>
          </div>
          <div class="modal-body">
            <!-- Budget Info -->
            <div class="alert alert-info d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>Quoted Price:</strong> PKR {{ quotedPricePerHead }} × {{ numberOfPeople }} people
              </div>
              <div class="fw-bold">Total: PKR {{ quotedTotal | number }}</div>
            </div>

            <!-- Menu Items Selection -->
            <div class="mb-3">
              <h6 class="fw-bold mb-3">Available Menu Items</h6>
              <div class="list-group">
                <div *ngFor="let item of menuItems" class="list-group-item border rounded-3 mb-2">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="form-check flex-grow-1">
                      <input class="form-check-input" type="checkbox" 
                        [id]="'item-' + item.itemId"
                        [(ngModel)]="item.selected"
                        (change)="updateCalculations()">
                      <label class="form-check-label ms-2" [for]="'item-' + item.itemId">
                        <strong>{{ item.itemName }}</strong>
                        <br>
                        <small class="text-muted">{{ item.description }}</small>
                      </label>
                    </div>
                    <div class="text-end" style="min-width: 200px;">
                      <span class="badge bg-primary mb-2">PKR {{ item.price }}</span>
                      <div class="input-group input-group-sm" *ngIf="item.selected">
                        <span class="input-group-text">Qty</span>
                        <input type="number" class="form-control" 
                          [(ngModel)]="item.quantity"
                          (ngModelChange)="updateCalculations()"
                          min="1" [max]="numberOfPeople" style="max-width: 70px;">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Calculation -->
            <div class="card bg-light border-0 p-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Selected Items Total:</span>
                <strong>PKR {{ selectedTotal | number }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Quoted Total:</span>
                <strong>PKR {{ quotedTotal | number }}</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">Difference:</span>
                <span [class]="getDifferenceClass()">
                  PKR {{ difference | number }} ({{ differencePercent | number:'1.1-1' }}%)
                  <i class="bi" [ngClass]="isWithinTolerance ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning'"></i>
                </span>
              </div>
              <small class="text-muted mt-2" *ngIf="!isWithinTolerance">
                <i class="bi bi-info-circle me-1"></i> Total should be within ±5% of quoted price
              </small>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancel</button>
            <button type="button" class="btn btn-success" 
              (click)="confirm()"
              [disabled]="!isWithinTolerance || selectedItems.length === 0">
              <i class="bi bi-check-circle me-1"></i> Confirm & Approve Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal.show {
      display: block;
    }
  `]
})
export class MenuSelectionModal {
    @Input() isVisible: boolean = false;
    @Input() restaurantName: string = '';
    @Input() offerType: string = '';
    @Input() quotedPricePerHead: number = 0;
    @Input() numberOfPeople: number = 0;
    @Output() onConfirm = new EventEmitter<MenuItem[]>();
    @Output() onClose = new EventEmitter<void>();

    menuItems: MenuItem[] = [];
    selectedTotal: number = 0;
    quotedTotal: number = 0;
    difference: number = 0;
    differencePercent: number = 0;
    isWithinTolerance: boolean = false;

    ngOnInit() {
        // Mock menu items - in real app, fetch from API
        this.menuItems = [
            { itemId: 1, itemName: 'Chicken Biryani', price: 400, description: 'Traditional aromatic rice dish', selected: false, quantity: this.numberOfPeople },
            { itemId: 2, itemName: 'Raita', price: 50, description: 'Yogurt side dish', selected: false, quantity: this.numberOfPeople },
            { itemId: 3, itemName: 'Salad', price: 50, description: 'Fresh garden salad', selected: false, quantity: this.numberOfPeople },
            { itemId: 4, itemName: 'Cold Drink', price: 100, description: 'Soft drinks', selected: false, quantity: this.numberOfPeople },
            { itemId: 5, itemName: 'Dessert', price: 150, description: 'Sweet dish', selected: false, quantity: this.numberOfPeople }
        ];

        this.quotedTotal = this.quotedPricePerHead * this.numberOfPeople;
        this.updateCalculations();
    }

    updateCalculations() {
        this.selectedTotal = this.menuItems
            .filter(item => item.selected)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);

        this.difference = Math.abs(this.selectedTotal - this.quotedTotal);
        this.differencePercent = (this.difference / this.quotedTotal) * 100;
        this.isWithinTolerance = this.differencePercent <= 5;
    }

    get selectedItems(): MenuItem[] {
        return this.menuItems.filter(item => item.selected);
    }

    getDifferenceClass(): string {
        if (this.isWithinTolerance) return 'text-success fw-bold';
        return 'text-warning fw-bold';
    }

    confirm() {
        if (this.isWithinTolerance && this.selectedItems.length > 0) {
            this.onConfirm.emit(this.selectedItems);
        }
    }

    close() {
        this.onClose.emit();
    }
}
