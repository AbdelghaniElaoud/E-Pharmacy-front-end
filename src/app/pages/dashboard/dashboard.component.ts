import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, SlicePipe} from "@angular/common";
import {Category} from "../../model/Category";
import {RouterLink} from "@angular/router";


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
  constructor(private http: HttpClient) {
  this.categoryObj = new Category();
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

  }
}
