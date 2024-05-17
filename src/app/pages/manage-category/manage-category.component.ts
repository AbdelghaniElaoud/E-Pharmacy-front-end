import {Component, OnInit} from '@angular/core';
import {Category} from "../../model/Category";
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {CategoryModel} from "../../model/CategoryModel";
import {FormsModule} from "@angular/forms";
import {AddCategoryComponent} from "../add-category/add-category.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.css'
})
export class ManageCategoryComponent implements OnInit{

  categories : CategoryModel[];
  categoryObj : Category;

  constructor(private http : HttpClient, private router: Router) {
    this.categories = [];
    this.categoryObj = new Category();
  }
  ngOnInit(): void {
    this.getAllCategories()
  }
  getAllCategories(){
    this.http.get('http://localhost:8080/api/categories').subscribe((res:any) =>{
      this.categories = res;
      console.warn(res);
    })
  }

  createCategory() {
    debugger;
    this.http.post('http://localhost:8080/api/categories',this.categoryObj).subscribe((res:any)=>{
      if (res.name != 0){
        alert("The category has been created!!");
      }else {
        alert(res.err)
      }
    })
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['category']);
    });
  }



}
