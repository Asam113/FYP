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

  constructor(private router: Router, private toastService: ToastService) { }

  login() {
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
          this.router.navigate(['/manager']);
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
