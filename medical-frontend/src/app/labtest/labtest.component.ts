import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../services/cart.service';
import { CartApiService } from '../services/cart-api.service';

interface LabTest {
  id: number;
  c: string;
  name: string;
  description: string;
  price: number;
  img: string;
  created_at?: string;
}

@Component({
  selector: 'app-labtest',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './labtest.component.html',
  styleUrl: './labtest.component.css'
})
export class LabtestComponent implements OnInit {
  labTests: LabTest[] = [];

  constructor(
    public cartService: CartService,
    private cartApiService: CartApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadLabTests();
  }

  loadLabTests(): void {
    this.http.get<LabTest[]>('http://localhost:3000/api/labtests').subscribe({
      next: (data) => {
        this.labTests = data;
        console.log('Lab tests loaded from backend:', data);
      },
      error: (err) => {
        console.error('Error loading lab tests:', err);
      }
    });
  }

  addToCart(test: LabTest): void {
    const item: CartItem = {
      id: test.c,
      name: test.name,
      price: Number(test.price),
      img: test.img,
      quantity: 1,
      type: 'labtest'
    };

    this.cartApiService.addToCart(item).subscribe({
      next: (res) => {
        this.cartService.addItem(item);
        console.log('Lab test added to DB:', res);
      },
      error: (err) => {
        console.error('Add lab test to cart failed:', err);
        alert(err.error?.message || 'Failed to add item to cart');
      }
    });
  }

  isInCart(test: LabTest): boolean {
    return this.cartService.cartItems().some(item => item.id === test.c);
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  view(test: LabTest): void {
    this.router.navigate(['/labtest', test.c]);
  }
}