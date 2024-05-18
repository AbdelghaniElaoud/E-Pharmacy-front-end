import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, SlicePipe} from "@angular/common";
import {Category} from "../../model/Category";
import {RouterLink} from "@angular/router";
import {CartService} from "../../service/cart-service/cart-service.service";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    SlicePipe,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  products:any[] = [];
  categoryObj : Category;
  cartItemCount: number = 0;
  cartProducts: [any, number][] = [];
  constructor(private http: HttpClient,private cartService: CartService) {
  this.categoryObj = new Category();
    this.cartService.cart$.subscribe(cartMap => {
      this.cartItemCount = this.cartService.getCartLength();
    });
    this.cartProducts = this.cartService.getProducts();

  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){

    this.http.get('http://localhost:8080/api/products').subscribe((res:any) => {
      this.products = res;
      console.log(this.products)
    },error => {
      alert('Could not fetch the data')
    })
  }


  addToCart(product: any) {
    this.cartService.addToCart(product);
    console.warn(this.cartProducts);
  }
}
