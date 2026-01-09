import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'tourist'; // Default role

  showPassword = false;
  showConfirmPassword = false;
  acceptedTerms = false;

  // Password Validation Flags
  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private router: Router, private toastService: ToastService) { }

  checkPassword() {
    this.hasMinLength = this.password.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(this.password);
    this.hasLowerCase = /[a-z]/.test(this.password);
    this.hasNumber = /\d/.test(this.password);
    this.hasSpecialChar = /[@$!%*?&]/.test(this.password);
  }

  signup() {
    if (!this.acceptedTerms) {
      this.toastService.show("Please accept the Terms and Conditions to proceed.", "error");
      return;
    }

    if (!(this.hasMinLength && this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSpecialChar)) {
      // Requirement: Don't show toast, just checklist. But we still block signup.
      // Optionally show a generic message if they try to click sign up.
      this.toastService.show("Please ensure your password meets all requirements listed below.", "error");
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastService.show("Passwords do not match!", "error");
      return;
    }

    // save user data in browser
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);
    localStorage.setItem('role', this.role);

    this.toastService.show("Signup Successful! Please login now.", "success");

    this.router.navigate(['/login']);
  }

}
