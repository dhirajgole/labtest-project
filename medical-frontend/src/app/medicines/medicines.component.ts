import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Fuse from 'fuse.js';
import { CartService, CartItem } from '../services/cart.service';
import { CartApiService } from '../services/cart-api.service';

type Medicine = {
  id?: number;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  price: number;
  img: string;
  c: string;
  requires_prescription?: boolean;
  requiresPrescription?: boolean;
};

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  suggestions: Medicine[] = [];
  searchText = '';
  private fuse!: Fuse<Medicine>;

  constructor(
    private router: Router,
    public cartService: CartService,
    private cartApiService: CartApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  private loadMedicines(): void {
    this.http.get<Medicine[]>('http://localhost:3000/api/medicines').subscribe({
      next: (data) => {
        this.medicines = data;
        this.filteredMedicines = [...this.medicines];
        this.initFuse();
        console.log('Medicines loaded from backend:', data);
      },
      error: (err) => {
        console.error('Error loading medicines from backend', err);
      }
    });
  }

  private initFuse(): void {
    this.fuse = new Fuse(this.medicines, {
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'category', weight: 0.2 },
        { name: 'manufacturer', weight: 0.1 },
        { name: 'description', weight: 0.1 }
      ]
    });
  }

  onSearchChange(): void {
    const query = this.searchText.trim();

    if (!query) {
      this.filteredMedicines = [...this.medicines];
      this.suggestions = [];
      return;
    }

    const results = this.fuse.search(query);
    this.suggestions = results.slice(0, 6).map(result => result.item);
    this.filteredMedicines = results.map(result => result.item);
  }

  selectSuggestion(item: Medicine): void {
    this.searchText = item.name;
    this.suggestions = [];
    this.filteredMedicines = [item];
  }

  addToCart(medicine: Medicine): void {
    const item: CartItem = {
      id: medicine.c,
      name: medicine.name,
      price: Number(medicine.price),
      img: medicine.img,
      category: medicine.category,
      quantity: 1,
      type: 'medicine'
    };

    this.cartApiService.addToCart(item).subscribe({
      next: (res) => {
        this.cartService.addItem(item);
        console.log('Medicine added to DB:', res);
      },
      error: (err) => {
        console.error('Add medicine to cart failed:', err);
        alert(err.error?.message || 'Failed to add item to cart');
      }
    });
  }

  isInCart(medicine: Medicine): boolean {
    return this.cartService.cartItems().some(item => item.id === medicine.c);
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  view(medicine: Medicine): void {
    this.router.navigate(['medicines', medicine.c]);
  }
}