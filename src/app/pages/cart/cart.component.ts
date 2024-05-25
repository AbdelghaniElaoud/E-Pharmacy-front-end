import { Component } from '@angular/core';
import { CartService } from "../../service/cart-service/cart-service.service";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    KeyValuePipe,
    FormsModule,
    NgIf
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

  constructor(private cartService: CartService) {
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
    if (!this.address) {
      alert('Please enter your address.');
      return;
    }

    if (this.requiresPrescription && (!this.prescriptionFile || !this.prescriptionDate || !this.prescriptionDoctor)) {
      alert('Please upload your prescription, and provide date and doctor information.');
      return;
    }

    this.cartService.updateAddress(this.address); // Update the address before placing the order
    // Logic to handle prescription file upload if required
    // Assuming there is a method in CartService to handle file upload
    if (this.prescriptionFile) {
      this.cartService.uploadPrescription(this.prescriptionFile, this.prescriptionDate, this.prescriptionDoctor, this.customerId)
        .then(() => {
          this.cartService.placeOrder();
        })
        .catch((error: any) => {
          console.error('Error uploading prescription:', error);
          alert(`Error uploading prescription: ${error.statusText}`);
        });
    } else {
      this.cartService.placeOrder();
    }
  }
}
