import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  data = {
    fname: '',
    mname: '',
    lname: '',
    gender: '',
    dob: '',
    email: '',
    mobile: '',
    username: '',
    password: ''
  };

  log() {
    this.router.navigate(['/login']);
  }

  a() {
    this.authService.register(this.data).subscribe({
      next: (res) => {
        alert(res.message || 'Successfully signed up');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}