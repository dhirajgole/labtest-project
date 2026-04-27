import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cbc',
  templateUrl: './cbc.component.html',
  styleUrls: ['./cbc.component.css']
})
export class CbcComponent {
  cbcTest = {
    id: 'cbc-test',
    name: 'Complete Blood Count (CBC)',
    price: 399,
    quantity: 1,
    type: 'labtest' as const,
    category: 'Blood Test',
    img : 'labtest1.jpg'
  };

  constructor(private cartService: CartService) {}

  addtocart() {
    this.cartService.addItem(this.cbcTest);
    alert('CBC Test added to cart!');
  }
}