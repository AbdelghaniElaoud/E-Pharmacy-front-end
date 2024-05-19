import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';


interface DecodedToken {
  sub: string; // Username
  // Other token claims
}

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit{
   cart: Map<any, number> = new Map();
   cartSubject = new BehaviorSubject<Map<any, number>>(this.cart);
  cart$ = this.cartSubject.asObservable();
  totalPrice: number = 0;
   activeCartId: number = 0;
   userId: number = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.decodeToken();
  }

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: DecodedToken = jwt_decode(token);
      const username = decodedToken.sub;
      this.fetchUserId(username);
    }
  }

  private fetchUserId(username: string): void {
    this.http
      .get<{ content: number; errors: any; ok: boolean }>(`http://localhost:8080/api/users/${username}`)
      .subscribe(
        (response) => {
          if (response.ok) {
            this.userId = response.content;
            this.getActiveCartId();
          } else {
            console.error('Error fetching user ID:', response.errors);
          }
        },
        (error) => {
          console.error('Error fetching user ID:', error);
        }
      );
  }

  getActiveCartId(): void {
    this.http
      .get<{ content: { id: number }[] }>(`http://localhost:8080/api/carts/get-cart/${this.userId}`)
      .subscribe(
        (response) => {
          if (response.content.length > 0) {
            this.activeCartId = response.content[0].id;
          }
        },
        (error) => {
          console.error('Error fetching active cart ID:', error);
        }
      );
  }

  addToCart(product: any) {
    const existingQuantity = this.cart.get(product) || 0;
    this.cart.set(product, existingQuantity + 1);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
    this.addItemToCartOnServer(existingQuantity + 1, product.id);
  }

  increaseQuantity(product: any) {
    const currentQuantity = this.cart.get(product) || 0;
    this.cart.set(product, currentQuantity + 1);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
    this.addItemToCartOnServer(currentQuantity + 1, product.id);
  }

  decreaseQuantity(product: any) {
    const currentQuantity = this.cart.get(product) || 0;
    if (currentQuantity > 1) {
      this.cart.set(product, currentQuantity - 1);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
      this.addItemToCartOnServer(currentQuantity - 1, product.id);
    } else {
      this.removeFromCart(product);
    }
  }

  removeFromCart(product: any) {
    this.cart.delete(product);
    this.updateTotalPrice();
    this.cartSubject.next(this.cart);
    this.removeItemFromCartOnServer(product.id);
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

  private addItemToCartOnServer(quantity: number, productId: number) {
    const requestBody = {
      quantity,
      productId,
      cartId: this.activeCartId
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http
      .post('http://localhost:8080/api/carts/add-item', requestBody, { headers })
      .subscribe(
        (response) => {
          console.log('Item added to cart successfully:', response);
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
  }

  private removeItemFromCartOnServer(productId: number) {
    const requestBody = {
      productId,
      cartId: this.activeCartId
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http
      .post('http://localhost:8080/api/carts/remove-item', requestBody, { headers })
      .subscribe(
        (response) => {
          console.log('Item removed from cart successfully:', response);
        },
        (error) => {
          console.error('Error removing item from cart:', error);
        }
      );
  }


}
