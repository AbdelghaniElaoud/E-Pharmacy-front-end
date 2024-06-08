import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, SlicePipe } from '@angular/common';
import { Category } from '../../model/Category';
import { RouterLink } from '@angular/router';
import { CartService } from '../../service/cart-service/cart-service.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    SlicePipe,
    RouterLink,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  searchTerm: string = '';
  cartItemCount: number = 0;
  cartProducts: [any, number][] = [];

  constructor(private http: HttpClient, private cartService: CartService) {
    this.cartService.cart$.subscribe(cartMap => {
      this.cartItemCount = this.cartService.getCartLength();
    });
    this.cartProducts = this.cartService.getProducts();
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
  }

  getAllProducts() {
    this.http.get('http://localhost:8080/api/products').subscribe((res: any) => {
      this.products = res;
      this.filteredProducts = res;
      console.log(this.products);
    }, error => {
      alert('Could not fetch the data');
    });
  }

  getCategories() {
    this.http.get('http://localhost:8080/api/categories').subscribe((res: any) => {
      this.categories = res;
    }, error => {
      alert('Could not fetch the categories');
    });
  }

  filterProducts(category? : any) {
    if (category){
      this.selectedCategory = category;
    }
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.selectedCategory === '' || product.category.name === this.selectedCategory) &&
        (this.minPrice === null || product.price >= this.minPrice) &&
        (this.maxPrice === null || product.price <= this.maxPrice) &&
        (this.searchTerm === '' || product.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    console.warn(this.cartProducts);
  }
}
