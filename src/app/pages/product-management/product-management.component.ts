import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
}

interface ProductDTOAdministration {
  name: string;
  price: number;
  code: string;
  prescription: boolean;
  stock: number;
  category: Category;
  active: boolean;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: ProductDTOAdministration[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<ProductDTOAdministration[]>('http://localhost:8080/api/products/manage')
      .subscribe(data => {
        this.products = data;
      }, error => {
        console.error('Error fetching products', error);
      });
  }
}
