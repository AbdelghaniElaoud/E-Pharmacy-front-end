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
  pharmacistId: number | null = null;

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.pharmacistId = this.getPharmacistIdFromToken();
    if (this.pharmacistId !== null) {
      this.ordersService.getOrdersByPharmacistId(this.pharmacistId).subscribe(
        data => this.orders = data,
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
}
