import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService, CartItem } from '../services/cart.service';
import { PaymentService } from '../services/payment.service';
import { CartApiService } from '../services/cart-api.service';

declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  isProcessing = false;
  isBrowser = false;

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private cartApiService: CartApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadRazorpayScript();
      this.loadCartFromDatabase();
    }
  }

  loadRazorpayScript() {
    if (!this.isBrowser) return;

    if (document.getElementById('razorpay-checkout-script')) return;

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  loadCartFromDatabase() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser?.token) {
      this.cartService.clearCart();
      return;
    }

    this.cartApiService.getMyCart().subscribe({
      next: (response: any) => {
        const items: CartItem[] = (response?.cart?.items || []).map((item: any) => ({
          id: item.item_id || item.id,
          name: item.name,
          price: Number(item.price),
          img: item.img,
          category: item.category,
          quantity: Number(item.quantity),
          type: item.type
        }));

        this.cartService.setCartItems(items);
      },
      error: (err) => {
        console.error('Load cart error:', err);
      }
    });
  }

  increaseQuantity(item: any) {
    const itemId = item.id;
    const newQuantity = item.quantity + 1;

    this.cartApiService.updateCart(itemId, newQuantity).subscribe({
      next: () => {
        this.cartService.updateQuantity(itemId, newQuantity);
      },
      error: (err) => {
        console.error('Increase quantity error:', err);
        alert('Failed to update quantity');
      }
    });
  }

  decreaseQuantity(item: any) {
    const itemId = item.id;

    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;

      this.cartApiService.updateCart(itemId, newQuantity).subscribe({
        next: () => {
          this.cartService.updateQuantity(itemId, newQuantity);
        },
        error: (err) => {
          console.error('Decrease quantity error:', err);
          alert('Failed to update quantity');
        }
      });
    } else {
      this.removeItem(itemId);
    }
  }

  removeItem(id: string) {
    this.cartApiService.removeFromCart(id).subscribe({
      next: () => {
        this.cartService.removeItem(id);
      },
      error: (err) => {
        console.error('Remove item error:', err);
        alert('Failed to remove item');
      }
    });
  }

  checkout() {
    if (!this.isBrowser) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser?.token) {
      alert('Please login first');
      return;
    }

    const items = this.cartService.cartItems();

    if (!items || items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const amount = this.cartService.totalPrice();

    this.isProcessing = true;

    this.paymentService.createOrder({ items, amount }).subscribe({
      next: (response: any) => {
        const razorpayOrder = response.razorpayOrder;

        const options = {
          key: 'rzp_test_SdjAOtt1NuZ0XL',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'MediCare Hub',
          description: 'Cart Payment',
          order_id: razorpayOrder.id,
          handler: (paymentResponse: any) => {
            this.verifyPayment(paymentResponse);
          },
          prefill: {
            name: currentUser?.fname
              ? `${currentUser.fname} ${currentUser.lname || ''}`.trim()
              : currentUser?.username || '',
            email: currentUser?.email || '',
            contact: currentUser?.mobile || ''
          },
          theme: {
            color: '#0f9aa8'
          },
          modal: {
            ondismiss: () => {
              this.isProcessing = false;
            }
          }
        };

        const rzp = new Razorpay(options);

        rzp.on('payment.failed', (response: any) => {
          console.error('Razorpay payment failed:', response);
          this.isProcessing = false;
          alert('Payment Failed');
        });

        rzp.open();
      },
      error: (err) => {
        console.error('Create order error:', err);
        this.isProcessing = false;
        alert(err.error?.message || 'Failed to create order');
      }
    });
  }

  verifyPayment(paymentResponse: any) {
    this.paymentService.verifyPayment(paymentResponse).subscribe({
      next: () => {
        this.cartApiService.clearCart().subscribe({
          next: () => {
            this.isProcessing = false;
            alert('Payment successful and order saved');
            this.cartService.clearCart();
          },
          error: (err) => {
            console.error('Clear cart error:', err);
            this.isProcessing = false;
            alert('Payment successful, but failed to clear cart');
          }
        });
      },
      error: (err) => {
        console.error('Verify payment error:', err);
        this.isProcessing = false;
        alert(err.error?.message || 'Payment verification failed');
      }
    });
  }
}