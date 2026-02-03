import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploaderComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profile: any = null;
  isEditMode = false;
  editFormData: any = {};
  selectedImages: File[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const user = this.authService.getUser();
    if (user && user.roleSpecificId) {
      this.restaurantService.getRestaurant(user.roleSpecificId).subscribe({
        next: (data) => {
          this.profile = data;
        },
        error: (err) => {
          this.toastService.show('Failed to load profile', 'error');
        }
      });
    }
  }

  editProfile() {
    this.editFormData = JSON.parse(JSON.stringify(this.profile));
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editFormData = {};
    this.selectedImages = [];
  }

  saveProfile() {
    // In a real app, we would call a service here to update the restaurant info
    // For now, let's focus on the images
    if (this.selectedImages.length > 0 && this.profile) {
      this.restaurantService.uploadRestaurantImages(this.profile.restaurantId, this.selectedImages).subscribe({
        next: () => {
          this.toastService.show('Profile updated with images', 'success');
          this.selectedImages = [];
          this.isEditMode = false;
          this.loadProfile();
        },
        error: () => {
          this.toastService.show('Failed to upload images', 'error');
        }
      });
    } else {
      this.isEditMode = false;
    }
  }

  onImagesSelected(files: File[]) {
    this.selectedImages = files;
  }

  onImageDeleted(imageId: number) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.restaurantService.deleteRestaurantImage(imageId).subscribe({
        next: () => {
          this.toastService.show('Image deleted', 'success');
          this.loadProfile();
        }
      });
    }
  }
}
