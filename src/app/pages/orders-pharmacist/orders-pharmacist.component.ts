import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../../service/order/order.service';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-orders-pharmacist',
  standalone: true,
  templateUrl: './orders-pharmacist.component.html',
  imports: [
    CommonModule,
    DatePipe,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./orders-pharmacist.component.css']
})
export class OrdersPharmacistComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  orderStatuses: string[] = ['INIT', 'CANCELED', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERING', 'COMPLETED', 'ISSUE', 'PRESCRIPTION_REFUSED'];
  selectedStatus: string = '';
  prescription: any = null;
  showOrderModal: boolean = false;
  showPrescriptionModal: boolean = false;
  selectedOrder: any = null;

  constructor(private ordersService: OrdersService, private http: HttpClient) { }

  ngOnInit(): void {
    const pharmacistId = this.getPharmacistIdFromToken();
    if (pharmacistId !== null) {
      this.ordersService.getOrdersByPharmacistId(pharmacistId).subscribe(
        data => {
          this.orders = data;
          this.filteredOrders = data; // Initially, all orders are shown
        },
        error => console.error(error)
      );
    }
  }

  getPharmacistIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    }
    return null;
  }

  filterOrders(status: string): void {
    this.selectedStatus = status;
    if (status) {
      this.filteredOrders = this.orders.filter(order => order.orderStatus === status);
    } else {
      this.filteredOrders = this.orders;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'INIT':
        return 'gray';
      case 'CANCELED':
        return 'red';
      case 'CONFIRMED':
        return 'green';
      case 'IN_PROGRESS':
        return 'orange';
      case 'DELIVERING':
        return 'blue';
      case 'COMPLETED':
        return 'purple';
      case 'ISSUE':
        return 'darkred';
      case 'PRESCRIPTION_REFUSED':
        return 'brown';
      default:
        return 'black';
    }
  }

  fetchPrescription(orderId: number): void {
    this.http.get(`http://localhost:8080/api/orders/${orderId}/prescriptions`).subscribe(
      (data: any) => {
        this.prescription = data.length > 0 ? data[0] : null;
        this.showPrescriptionModal = true;
      },
      error => {
        console.error(error);
        this.prescription = null;
        this.showPrescriptionModal = true;
      }
    );
  }

  closeModal(): void {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }

  closePrescriptionModal(): void {
    this.showPrescriptionModal = false;
    this.prescription = null;
  }

  onRowClick(order: any) {
    this.http.get(`http://localhost:8080/api/orders/${order.id}`).subscribe(
      (response: any) => {
        this.selectedOrder = response.content;
        this.showOrderModal = true;
      },
      error => console.error(error)
    );
  }

  confirmOrder(orderId: number): void {
    this.http.put(`http://localhost:8080/api/orders/${orderId}/confirm-order`, {}).subscribe(
      (response: any) => {
        console.log('Order confirmed:', response);
        // Ensure the response structure is correct
        if (response && response.content) {
          this.updateOrderStatus(orderId, 'CONFIRMED');
          this.generatePDFReceipt(response.content);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      error => {
        console.error('Error confirming order:', error);
        // Additional error handling if needed
      }
    );
  }

  cancelOrder(orderId: number): void {
    this.http.put(`http://localhost:8080/api/orders/${orderId}/cancel-order`, {}).subscribe(
      (response: any) => {
        console.log('Order canceled:', response);
        // Update the order status in the UI
        this.updateOrderStatus(orderId, 'CANCELED');
      },
      error => console.error(error)
    );
  }

  updateOrderStatus(orderId: number, status: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
    }
    this.filterOrders(this.selectedStatus);
  }

  generatePDFReceipt(data: any): void {
    const { orderDTO: order, customer, pharmacistDTO: pharmacist } = data;

    if (!order || !customer || !pharmacist) {
      console.error('Invalid order data');
      return;
    }

    const doc = new jsPDF();

    // Set title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Receipt', 10, 10);

    // Customer Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text('Customer Information', 10, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Name: ${customer.username}`, 10, 30);
    doc.text(`Email: ${customer.email}`, 10, 40);
    doc.text(`Phone: ${customer.phone}`, 10, 50);
    doc.text(`Address: ${customer.address}`, 10, 60);

    // Pharmacist Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text('Pharmacist Information', 10, 80);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Name: ${pharmacist.username}`, 10, 90);
    doc.text(`Email: ${pharmacist.email}`, 10, 100);

    // Order Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text('Order Information', 10, 120);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Total Price: ${order.totalPrice}`, 10, 140);
    doc.text('Products:', 10, 150);

    // Products
    let yOffset = 160;
    if (order.entries && Array.isArray(order.entries)) {
      order.entries.forEach((entry: any) => {
        doc.text(`- ${entry.product.name}: ${entry.quantity} x ${entry.basePrice} = ${entry.totalPrice}`, 10, yOffset);
        yOffset += 10;
      });
    } else {
      doc.text('No products available', 10, yOffset);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your purchase!', 10, yOffset + 20);

    doc.save(`Receipt_Order_${order.id}.pdf`);
  }
}
