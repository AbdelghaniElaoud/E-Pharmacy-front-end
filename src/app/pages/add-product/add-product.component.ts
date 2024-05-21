import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  product = {
    name: '',
    price: 0,
    code: '',
    prescription: false,
    description: '',
    stock: 0,
    category: {
      id: 0
    }
  };

  categories : any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<any[]>('http://localhost:8080/api/categories')
      .subscribe(data => {
        this.categories = data;
      }, error => {
        console.error('Error fetching categories', error);
      });
  }

  onSubmit() {
    this.http.post('http://localhost:8080/api/products', this.product)
      .subscribe((response: any) => {
        console.log('Product added successfully', response);
        // Navigate to media upload component with the new product ID
        this.router.navigate(['/add-media', response.id]);
      }, error => {
        console.error('Error adding product', error);
      });
  }

}
