import { Component } from '@angular/core';
import { CartService } from "../../service/cart-service/cart-service.service";
import { KeyValuePipe, NgForOf } from "@angular/common";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    KeyValuePipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: Map<any, number>;
  totalPrice: number;

  constructor(private cartService: CartService) {
    this.cartItems = new Map();
    this.totalPrice = 0;
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.totalPrice = this.cartService.totalPrice;
    });
  }

  increaseQuantity(product: any): void {
    this.cartService.increaseQuantity(product);
  }

  decreaseQuantity(product: any): void {
    this.cartService.decreaseQuantity(product);
  }

  removeFromCart(product: any): void {
    this.cartService.removeFromCart(product);
  }

  isQuantityOne(product: any): boolean {
    const currentQuantity = this.cartItems.get(product) || 0;
    return currentQuantity === 1;
  }
}
