import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  imports: [
    CommonModule,
    CurrencyPipe,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const customerId = this.getCustomerIdFromToken();
    if (customerId !== null) {
      this.fetchOrders(customerId);
    }
  }

  getCustomerIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    }
    return null;
  }

  fetchOrders(customerId: number): void {
    this.http.get(`http://localhost:8080/api/orders/${customerId}/incomplete`).subscribe(
      (data: any) => {
        console.log('Orders received:', data); // Debugging line
        this.orders = data;
      },
      error => console.error(error)
    );
  }

  getStatusMessage(status: string): string {
    const statusMessages: { [key: string]: string } = {
      INIT: 'Processing your order',
      CANCELED: 'There is an issue, you will be contacted soon',
      ISSUE: 'There is an issue, you will be contacted soon',
      PRESCRIPTION_REFUSED: 'There is an issue, you will be contacted soon',
      CONFIRMED: 'On the way',
      IN_PROGRESS: 'On the way',
      DELIVERING: 'On the way',
      COMPLETED: 'Completed'
    };
    return statusMessages[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'INIT':
        return 'processing';
      case 'CANCELED':
      case 'ISSUE':
      case 'PRESCRIPTION_REFUSED':
        return 'issue';
      case 'CONFIRMED':
      case 'IN_PROGRESS':
      case 'DELIVERING':
        return 'on-the-way';
      case 'COMPLETED':
        return 'completed';
      default:
        return '';
    }
  }
}
