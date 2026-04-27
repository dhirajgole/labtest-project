import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private router: Router,
    public cartService: CartService
  ) {}

  user() {
  const currentUser = localStorage.getItem('currentUser');

  if (currentUser) {
    this.router.navigate(['/dashboard']);
  } else {
    this.router.navigate(['/login']);
  }
}

  cart() {
    this.router.navigate(['/cart']);
  }
}