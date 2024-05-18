import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LayoutComponent} from "./pages/layout/layout.component";
import {AddCategoryComponent} from "./pages/add-category/add-category.component";
import {ManageCategoryComponent} from "./pages/manage-category/manage-category.component";
import {ProductDetailsComponent} from "./pages/product-details/product-details.component";
import {CartComponent} from "./pages/cart/cart.component";

export const routes: Routes = [
  {
  path : '',redirectTo:'login', pathMatch:'full'
  },
  {
    path: 'login', component : LoginComponent
  },
  {
    path: '',
    component : LayoutComponent,
    children : [
      {
        path: 'dashboard', component : DashboardComponent
      },
      {
        path: 'create-category', component : AddCategoryComponent
      },
      {
        path: 'category', component : ManageCategoryComponent
      },
      {
        path: 'product-details/:id', component : ProductDetailsComponent
      },
      {
        path: 'cart', component : CartComponent
      }
    ]
  }
];
