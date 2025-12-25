import { CommonModule, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  login() {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (this.email === savedEmail && this.password === savedPassword) {
      alert("Login Successful!");
      this.router.navigate(['/home']); // change to your dashboard route
    } else {
      alert("Invalid email or password");
    }
  }

}
