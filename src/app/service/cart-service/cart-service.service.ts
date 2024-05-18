import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Map<any, number> = new Map();
  private cartSubject = new BehaviorSubject<Map<any, number>>(this.cart);
  cart$ = this.cartSubject.asObservable();
  totalPrice: number = 0;

  addToCart(product: any) {
    const existingQuantity = this.cart.get(product) || 0;
    this.cart.set(product, existingQuantity + 1);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
  }

  increaseQuantity(product: any) {
    const currentQuantity = this.cart.get(product) || 0;
    this.cart.set(product, currentQuantity + 1);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
  }

  decreaseQuantity(product: any) {
    const currentQuantity = this.cart.get(product) || 0;
    if (currentQuantity > 1) {
      this.cart.set(product, currentQuantity - 1);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
    } else {
      this.removeFromCart(product);
    }
  }

  removeFromCart(product: any) {
    this.cart.delete(product);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
  }

  getProducts() {
    return [...this.cart.keys()];
  }

  getCartLength() {
    return this.cart.size;
  }

  private updateTotalPrice() {
    this.totalPrice = 0;
    for (const [product, quantity] of this.cart.entries()) {
      this.totalPrice += product.price * quantity;
    }
  }
}
