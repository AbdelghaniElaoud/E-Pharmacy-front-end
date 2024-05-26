import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {OrdersService} from "../../service/order/order.service";

@Component({
  selector: 'app-orders-pharmacist',
  standalone: true,
  templateUrl: './orders-pharmacist.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./orders-pharmacist.component.css']
})
export class OrdersPharmacistComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  orderStatuses: string[] = ['INIT', 'CANCELED', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERING', 'COMPLETED', 'ISSUE', 'PRESCRIPTION_REFUSED'];
  selectedStatus: string = '';

  constructor(private ordersService: OrdersService) { }

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
}
