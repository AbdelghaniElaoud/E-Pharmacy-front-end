import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jwt_decode, { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // Username
  id: number; // Other token claims
}

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
  cart: Map<any, number> = new Map();
  cartSubject = new BehaviorSubject<Map<any, number>>(this.cart);
  cart$ = this.cartSubject.asObservable();
  totalPrice: number = 0;
  activeCartId: number = 0;
  userId: number = 0;
  private initializationPromise: Promise<void>;

  constructor(private http: HttpClient) {
    this.initializationPromise = this.initializeService();
  }

  ngOnInit(): void {}

  private async initializeService(): Promise<void> {
    try {
      this.decodeToken();
      await this.getActiveCartId();
      await this.loadCartItems();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  private decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      this.userId = decodedToken.id;
    }
  }

  private getActiveCartId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ content: { id: number }, errors: any, ok: boolean }>(`http://localhost:8080/api/carts/get-cart/${this.userId}`)
        .subscribe(
          (response) => {
            if (response.ok) {
              this.activeCartId = response.content.id;
              console.log(this.activeCartId);
              resolve();
            } else {
              reject('No active cart found');
            }
          },
          (error) => {
            console.error('Error fetching active cart ID:', error);
            reject(error);
          }
        );
    });
  }

  private loadCartItems(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ content: any, errors: any, ok: boolean }>(`http://localhost:8080/api/carts/${this.activeCartId}`)
        .subscribe(
          (response) => {
            if (response.ok) {
              const cartEntries = response.content.entries;
              cartEntries.forEach((entry: any) => {
                this.cart.set(entry.product, entry.quantity);
              });
              this.updateTotalPrice();
              this.cartSubject.next(this.cart);
              resolve();
            } else {
              reject('Failed to load cart items');
            }
          },
          (error) => {
            console.error('Error loading cart items:', error);
            reject(error);
          }
        );
    });
  }

  addToCart(product: any) {
    this.initializationPromise.then(() => {
      if (this.activeCartId === 0) {
        console.error('Active cart ID is not initialized');
        return;
      }
      const existingQuantity = this.cart.get(product) || 0;
      this.cart.set(product, existingQuantity + 1);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
      this.addItemToCartOnServer(existingQuantity + 1, product.id);
    }).catch((error) => {
      console.error('Error adding to cart:', error);
    });
  }

  increaseQuantity(product: any) {
    this.initializationPromise.then(() => {
      if (this.activeCartId === 0) {
        console.error('Active cart ID is not initialized');
        return;
      }
      const currentQuantity = this.cart.get(product) || 0;
      this.cart.set(product, currentQuantity + 1);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
      this.addItemToCartOnServer(currentQuantity + 1, product.id);
    }).catch((error) => {
      console.error('Error increasing quantity:', error);
    });
  }

  decreaseQuantity(product: any) {
    this.initializationPromise.then(() => {
      if (this.activeCartId === 0) {
        console.error('Active cart ID is not initialized');
        return;
      }
      const currentQuantity = this.cart.get(product) || 0;
      if (currentQuantity > 1) {
        this.cart.set(product, currentQuantity - 1);
        this.updateTotalPrice();
        this.cartSubject.next(this.cart);
        this.addItemToCartOnServer(currentQuantity - 1, product.id);
      } else {
        this.removeFromCart(product);
      }
    }).catch((error) => {
      console.error('Error decreasing quantity:', error);
    });
  }

  removeFromCart(product: any) {
    this.initializationPromise.then(() => {
      if (this.activeCartId === 0) {
        console.error('Active cart ID is not initialized');
        return;
      }
      this.cart.delete(product);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
      this.removeItemFromCartOnServer(product.id);
    }).catch((error) => {
      console.error('Error removing from cart:', error);
    });
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

  placeOrder() {
    this.initializationPromise.then(() => {
      if (this.activeCartId === 0) {
        console.error('Active cart ID is not initialized');
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

      this.http
        .post(`http://localhost:8080/api/carts/${this.activeCartId}/place-order`, {}, { headers })
        .subscribe(
          (response) => {
            console.log('Order placed successfully:', response);
            // Handle success, perhaps clear the cart or navigate to an order confirmation page
          },
          (error) => {
            console.error('Error placing order:', error);
          }
        );
    }).catch((error) => {
      console.error('Error placing order:', error);
    });
  }
}
