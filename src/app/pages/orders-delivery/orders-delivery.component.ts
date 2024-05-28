import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders-delivery',
  standalone: true,
  templateUrl: './orders-delivery.component.html',
  imports: [
    CommonModule,
    DatePipe,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./orders-delivery.component.css']
})
export class OrdersDeliveryComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const deliveryManId = this.getDeliveryIdFromToken();
    if (deliveryManId !== null) {
      this.fetchOrders(deliveryManId);
    }
  }

  getDeliveryIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    }
    return null;
  }

  fetchOrders(deliveryManId: number): void {
    this.http.get(`http://localhost:8080/api/orders/${deliveryManId}/all-orders/delivery`).subscribe(
      (data: any) => {
        this.orders = data;
      },
      error => console.error(error)
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'INIT':
        return 'init';
      case 'CANCELED':
        return 'canceled';
      case 'CONFIRMED':
        return 'confirmed';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'DELIVERING':
        return 'delivering';
      case 'COMPLETED':
        return 'completed';
      case 'ISSUE':
        return 'issue';
      case 'PRESCRIPTION_REFUSED':
        return 'prescription-refused';
      default:
        return '';
    }
  }

  markAsDelivered(orderId: number): void {
    this.http.put(`http://localhost:8080/api/orders/${orderId}/delivered`, {}).subscribe(
      () => {
        this.refreshOrders();
      },
      error => console.error(error)
    );
  }

  reportIssue(orderId: number): void {
    this.http.put(`http://localhost:8080/api/orders/${orderId}/issue-delivery`, {}).subscribe(
      () => {
        this.refreshOrders();
      },
      error => console.error(error)
    );
  }

  refreshOrders(): void {
    const deliveryManId = this.getDeliveryIdFromToken();
    if (deliveryManId !== null) {
      this.fetchOrders(deliveryManId);
    }
  }
}
