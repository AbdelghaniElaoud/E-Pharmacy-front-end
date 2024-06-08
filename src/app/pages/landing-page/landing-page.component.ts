import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.http.get('http://localhost:8080/api/products').subscribe((res: any) => {
      this.products = res;
      this.filteredProducts = this.products.slice(0, 3); // Show only the first three products
    }, error => {
      alert('Could not fetch the data');
    });
  }
}
