import { CommonModule, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  login() {
    if (!this.email || !this.password) {
      this.toastService.show("Please enter email and password", "error");
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.toastService.show("Login Successful!", "success");

        // Role comes from backend as 'Admin', 'Tourist', etc.
        const role = response.user.role;
        const status = response.user.status;

        if ((role === 'Restaurant' || role === 'Driver') && status !== 'Approved') {
          this.router.navigate(['/account-pending']);
          return;
        }

        if (role === 'Tourist') {
          this.router.navigate(['/tourist']);
        } else if (role === 'Driver') {
          this.router.navigate(['/driver']);
        } else if (role === 'Restaurant') {
          this.router.navigate(['/restaurant']);
        } else if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        const errorMessage = error.error?.message || "Invalid email or password";
        this.toastService.show(errorMessage, "error");
      }
    });
  }
}
