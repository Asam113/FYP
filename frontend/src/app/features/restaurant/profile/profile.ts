import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';
import { environment } from '../../../../environments/environment';

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
  enlargedImageUrl: string | null = null;

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
          // Prefix image URLs if they are relative
          if (data && data.restaurantImages) {
            data.restaurantImages = data.restaurantImages.map((img: any) => ({
              ...img,
              imageUrl: img.imageUrl.startsWith('http') ? img.imageUrl : `${environment.apiUrl}${img.imageUrl}`
            }));
          }
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

    // If we are not in edit mode, upload immediately to the gallery
    if (!this.isEditMode && this.selectedImages.length > 0 && this.profile) {
      this.uploadImages();
    }
  }

  uploadImages() {
    if (!this.profile || this.selectedImages.length === 0) return;

    this.restaurantService.uploadRestaurantImages(this.profile.restaurantId, this.selectedImages).subscribe({
      next: () => {
        this.toastService.show('Images uploaded successfully', 'success');
        this.selectedImages = [];
        this.loadProfile();
      },
      error: () => {
        this.toastService.show('Failed to upload images', 'error');
      }
    });
  }

  enlargeImage(url: string) {
    this.enlargedImageUrl = url;
  }

  closeLightbox() {
    this.enlargedImageUrl = null;
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
