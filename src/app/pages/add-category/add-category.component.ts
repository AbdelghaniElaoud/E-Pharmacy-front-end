import { Component } from '@angular/core';
import {Category} from "../../model/Category";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  categoryObj : Category;

  constructor(private http: HttpClient) {
    this.categoryObj = new Category();
  }

  createCategory() {
    debugger;
    this.http.post('http://localhost:8080/api/categories',this.categoryObj).subscribe((res:any)=>{
      if (res.name != 0){
        /*alert("The category has been created!!");*/
      }else {
        alert(res.err)
      }
    })
  }
}
