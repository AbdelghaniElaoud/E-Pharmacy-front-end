import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
}

interface ProductDTOAdministration {
  id: number;
  name: string;
  price: number;
  code: string;
  prescription: boolean;
  stock: number;
  category: Category;
  active: boolean;
  isEditing?: boolean; // Add isEditing property
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
  categories: Category[] = []; // List of all categories

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts(): void {
    this.http.get<ProductDTOAdministration[]>('http://localhost:8080/api/products/manage')
      .subscribe(data => {
        this.products = data;
      }, error => {
        console.error('Error fetching products', error);
      });
  }

  fetchCategories(): void {
    this.http.get<Category[]>('http://localhost:8080/api/categories')
      .subscribe(data => {
        this.categories = data;
      }, error => {
        console.error('Error fetching categories', error);
      });
  }

  toggleActive(product: ProductDTOAdministration): void {
    this.http.put(`http://localhost:8080/api/products/show-product/${product.id}`, {})
      .subscribe(() => {
        product.active = !product.active;
      }, error => {
        console.error('Error updating product', error);
      });
  }

  modifyProduct(product: ProductDTOAdministration): void {
    product.isEditing = true;
  }

  saveProduct(product: ProductDTOAdministration): void {
    const updatePayload = {
      name: product.name,
      price: product.price,
      code: product.code,
      prescription: product.prescription,
      stock: product.stock,
      category: {
        id: product.category.id
      }
    };

    this.http.put(`http://localhost:8080/api/products/update-product/${product.id}`, updatePayload)
      .subscribe(() => {
        product.isEditing = false;
      }, error => {
        console.error('Error updating product', error);
      });
  }

  cancelEdit(product: ProductDTOAdministration): void {
    product.isEditing = false;
    this.fetchProducts(); // Reload the products to discard changes
  }

  deleteProduct(productId: number): void {
    this.http.delete(`http://localhost:8080/api/products/${productId}/remove-product`)
      .subscribe(() => {
        this.products = this.products.filter(product => product.id !== productId);
      }, error => {
        console.error('Error deleting product:', error);
      });
  }
}
