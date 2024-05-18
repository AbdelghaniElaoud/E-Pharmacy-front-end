import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>(this.cart);
  cart$ = this.cartSubject.asObservable();

  private products: any[] = [];

  addToCart(product: any) {
    this.cart.push(product);
    this.products.push(product);
    this.cartSubject.next(this.cart);
  }

  getCartLength() {
    return this.cart.length;
  }

  getProducts() {
    return this.products;
  }
}
