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
    this.cartItems = this.cartService.cart;
    this.totalPrice = this.cartService.totalPrice;
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.totalPrice = this.cartService.totalPrice;
    });
  }

  increaseQuantity(product: any): void {
    const currentQuantity = this.cartItems.get(product) || 0;
    this.cartItems.set(product, currentQuantity + 1);
    this.cartService.increaseQuantity(product);
  }

  decreaseQuantity(product: any): void {
    const currentQuantity = this.cartItems.get(product) || 0;
    if (currentQuantity > 1) {
      this.cartItems.set(product, currentQuantity - 1);
    } else {
      this.removeFromCart(product);
    }
    this.cartService.decreaseQuantity(product);
  }

  removeFromCart(product: any): void {
    this.cartItems.delete(product);
    this.cartService.removeFromCart(product);
  }

  isQuantityOne(product: any): boolean {
    const currentQuantity = this.cartItems.get(product) || 0;
    return currentQuantity === 1;
  }
}
