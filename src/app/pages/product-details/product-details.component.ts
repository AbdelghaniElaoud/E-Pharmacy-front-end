import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {Location} from '@angular/common';
import {CartService} from "../../service/cart-service/cart-service.service";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  productId : number | undefined;
  product : any;
  selectedImageIndex: number = 0;
  constructor(private route: ActivatedRoute, private  http:HttpClient, private _location : Location, private cartService: CartService) {
    this.product = [];
    this.selectedImageIndex = 0;
  }

  ngOnInit(): void {
    // Retrieve the product ID from route parameters
    debugger;
    this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.http.get('http://localhost:8080/api/products/'+this.productId).subscribe((res:any)=>{
        this.product = res;
      })
    });
  }

  backClicked() {
    this._location.back();
  }

  addToCartClicked() {
    this.cartService.addToCart(this.product);
  }
}
