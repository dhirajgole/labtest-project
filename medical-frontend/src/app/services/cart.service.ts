import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  img?: string;
  category?: string;
  quantity: number;
  type: 'labtest' | 'medicine';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);

  cartItems = this.items.asReadonly();

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  setCartItems(items: CartItem[]) {
    this.items.set(items);
  }

  addItem(item: CartItem) {
    const existingItem = this.items().find(x => x.id === item.id);

    if (existingItem) {
      this.items.update(items =>
        items.map(x =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        )
      );
    } else {
      this.items.update(items => [...items, { ...item, quantity: item.quantity || 1 }]);
    }
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  removeItem(id: string) {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }
}