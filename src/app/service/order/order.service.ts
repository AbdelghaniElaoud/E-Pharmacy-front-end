import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Order {
  id: number;
  totalPrice: number;
  orderStatus: string;
  entries: { product: { name: string }, quantity: number, totalPrice: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private customerId: number | null;

  constructor(private http: HttpClient) {
    this.customerId = null;
  }

  getOrdersByPharmacistId(pharmacistId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${pharmacistId}/all-orders/pharmacist`);
  }

  getCustomerIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    }
    return null;
  }

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    const url = `${this.apiUrl}/${customerId}/incomplete`;
    return this.http.get<Order[]>(url);
  }
}
