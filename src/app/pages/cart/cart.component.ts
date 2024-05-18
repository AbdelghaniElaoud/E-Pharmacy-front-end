import { Component } from '@angular/core';
import {CartService} from "../../service/cart-service/cart-service.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartProducts: any[] = [];
  cartItemCount: number = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.length;
    });
    this.cartProducts = this.cartService.getProducts();
  }

}
