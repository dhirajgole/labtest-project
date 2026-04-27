import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  identifier: string = '';
  password: string = '';

  sign() {
    this.router.navigate(['/register']);
  }

  forgot() {
    this.router.navigate(['/forgot-password']);
  }

  s() {
    this.authService.login({
      identifier: this.identifier,
      password: this.password
    }).subscribe({
      next: (res) => {
        alert('Successfully logged in');
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(err.error?.message || 'Invalid details');
      }
    });
  }
}