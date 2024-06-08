import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {BehaviorSubject, catchError, from, map, Observable, switchMap} from 'rxjs';
import  {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  sub: string; // Username
  id: number; // Other token claims
}

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
  cart: Map<any, number> = new Map();
  private cartSubject = new BehaviorSubject<Map<any, number>>(this.cart);
  cart$ = this.cartSubject.asObservable();
  totalPrice: number = 0;
  activeCartId: number = 0;
  userId: number = 0;
  address: string = '';
  requiresPrescription: boolean = false;
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
              this.address = response.content.address;
              this.requiresPrescription = false;

              cartEntries.forEach((entry: any) => {
                this.cart.set(entry.product, entry.quantity);
                if (entry.product.prescription) {
                  this.requiresPrescription = true;
                }
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
      // this.cart.set(product, currentQuantity + 1);
      this.updateTotalPrice();
      this.cartSubject.next(this.cart);
      this.addItemToCartOnServer(currentQuantity /*+ 1*/, product.id);
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
      if (currentQuantity >= 1) {
        // this.cart.set(product, currentQuantity - 1);
        this.updateTotalPrice();
        this.cartSubject.next(this.cart);
        this.addItemToCartOnServer(currentQuantity /*- 1*/, product.id);
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

  placeOrder(): Observable<any> {
    return from(this.initializationPromise).pipe(
      switchMap(() => {
        if (this.activeCartId === 0) {
          throw new Error('Active cart ID is not initialized');
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        console.log('Sending place order request...');
        return this.http.post(`http://localhost:8080/api/orders/${this.activeCartId}/place-order`, {}, { headers }).pipe(
          map(response => {
            console.log('Order placed successfully:', response);
            return response;
          }),
          catchError(error => {
            console.error('Error placing order:', error);
            throw error;
          })
        );
      })
    );
  }

  updateAddress(address: string): void {
    const requestBody = {
      line: address,
      cartId: this.activeCartId
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.post('http://localhost:8080/api/carts/add-address', requestBody, { headers })
      .subscribe(
        (response) => {
          console.log('Address updated successfully:', response);
          this.address = address;
          this.cartSubject.next(this.cart); // Notify subscribers of the updated address
        },
        (error) => {
          console.error('Error updating address:', error);
        }
      );
  }

  uploadPrescription(file: File, date: string, doctor: string, customerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const formattedDate = new Date(date).toLocaleDateString('en-GB'); // Format date as dd/MM/yyyy

      const formData = new FormData();
      formData.append('file', file);
      formData.append('prescriptionRequestDTO', new Blob([JSON.stringify({ date: formattedDate, doctor, customerId })], { type: 'application/json' }));
      formData.append('cartId', this.activeCartId.toString());

      const token = localStorage.getItem('token');
      if (!token) {
        reject('No token found');
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(`http://localhost:8080/api/carts/${this.activeCartId}/add-prescription`, formData, { headers })
        .subscribe(
          (response) => {
            console.log('Prescription uploaded successfully:', response);
            resolve();
          },
          (error) => {
            console.error('Error uploading prescription:', error);
            reject(error);
          }
        );
    });
  }
}
