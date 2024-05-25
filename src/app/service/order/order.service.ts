import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByPharmacistId(pharmacistId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${pharmacistId}/all-orders/pharmacist`);
  }
}
