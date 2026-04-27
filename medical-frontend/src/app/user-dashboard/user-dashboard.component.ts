import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  user: any = {};
  isBrowser = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.user = JSON.parse(currentUser);
      }
    }
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('reglog');
    }
    this.router.navigate(['/login']);
  }

  orders = [
    {
      orderId: 'ORD1024',
      date: '2026-04-01',
      total: 540,
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      items: [
        { name: 'Paracetamol 650', quantity: 2, price: 120 },
        { name: 'Vitamin C Tablets', quantity: 1, price: 300 }
      ]
    }
  ];

  labBookings = [
    {
      testName: 'Complete Blood Count (CBC)',
      bookingDate: '2026-04-09',
      slot: '8:00 AM - 9:00 AM',
      collectionStatus: 'Scheduled',
      reportStatus: 'Pending'
    }
  ];
}