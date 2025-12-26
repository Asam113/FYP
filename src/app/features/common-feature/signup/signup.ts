import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'tourist'; // Default role

  constructor(private router: Router, private toastService: ToastService) { }

  signup() {
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
