import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) { }

  signup() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // save user data in browser
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);

    alert("Signup Successful! Please login now.");

    this.router.navigate(['/login']);
  }

}
