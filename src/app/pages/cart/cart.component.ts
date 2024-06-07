import {Component, OnInit} from '@angular/core';
import { CartService } from "../../service/cart-service/cart-service.service";
import {CurrencyPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import toastr from 'toastr';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    KeyValuePipe,
    FormsModule,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: Map<any, number>;
  totalPrice: number;
  address: string = '';
  prescriptionItems: any[] = [];
  requiresPrescription: boolean = false;
  prescriptionFile: File | null = null;
  prescriptionDate: string = '';
  prescriptionDoctor: string = '';
  customerId: number = 0;

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.cart;
    this.totalPrice = this.cartService.totalPrice;
    this.address = this.cartService.address;
    this.requiresPrescription = this.cartService.requiresPrescription;
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.totalPrice = this.cartService.totalPrice;
      this.address = this.cartService.address;
      this.requiresPrescription = this.cartService.requiresPrescription;
      this.updatePrescriptionItems();
      this.customerId = this.cartService.userId; // assuming customerId is the same as userId
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
    this.refreshComponent();
  }

  isQuantityOne(product: any): boolean {
    const currentQuantity = this.cartItems.get(product) || 0;
    return currentQuantity === 1;
  }

  updatePrescriptionItems(): void {
    this.prescriptionItems = [];
    this.cartItems.forEach((quantity, product) => {
      if (product.prescription) {
        this.prescriptionItems.push(product);
      }
    });
  }

  handlePrescriptionFileInput(event: any): void {
    this.prescriptionFile = event.target.files[0];
  }

  placeOrder(): void {
    console.log('placeOrder method called');
    if (!this.address) {
      alert('Please enter your address.');
      return;
    }

    if (this.requiresPrescription && (!this.prescriptionFile || !this.prescriptionDate || !this.prescriptionDoctor)) {
      alert('Please upload your prescription, and provide date and doctor information.');
      return;
    }

    this.cartService.updateAddress(this.address);

    if (this.prescriptionFile) {
      this.cartService.uploadPrescription(this.prescriptionFile, this.prescriptionDate, this.prescriptionDoctor, this.customerId)
        .then(() => {
          this.cartService.placeOrder().subscribe(
            response => {
              console.log('Order placed successfully:', response);
              alert("Order placed successfully")
              toastr.success('Message sent successfully!');
              this.refreshComponent();
            },
            error => {
              console.error('Error placing order:', error);
            }
          );
        })
        .catch((error: any) => {
          console.error('Error uploading prescription:', error);
          alert(`Error uploading prescription: ${error.statusText}`);
        });
    } else {
      this.cartService.placeOrder().subscribe(
        response => {
          console.log('Order placed successfully:', response)
          alert("Order placed successfully")
          toastr.success('Message sent successfully!');
          this.refreshComponent();
        },
        error => {
          console.error('Error placing order:', error);
        }
      );
    }
  }

  refreshComponent() {
    this.router.navigate([this.router.url])
      .then(() => {
        window.location.reload();
      });
  }
}
