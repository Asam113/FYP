import { CommonModule, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';


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

  constructor(private router: Router, private toastService: ToastService) { }

  login() {
    // Check for hardcoded Admin credentials
    if (this.email === 'admin@safarnama.com' && this.password === 'Admin@123') {
      this.toastService.show("Welcome Admin!", "success");
      this.router.navigate(['/admin']);
      return;
    }

    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (this.email === savedEmail && this.password === savedPassword) {
      this.toastService.show("Login Successful!", "success");

      const role = localStorage.getItem('role');

      switch (role) {
        case 'tourist':
          this.router.navigate(['/tourist']);
          break;
        case 'driver':
          this.router.navigate(['/driver']);
          break;
        case 'manager':
          this.router.navigate(['/restaurant']);
          break;
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/home']);
          break;
      }
    } else {
      this.toastService.show("Invalid email or password", "error");
    }
  }

}
