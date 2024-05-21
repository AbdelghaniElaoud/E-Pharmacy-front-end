import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LayoutComponent} from "./pages/layout/layout.component";
import {AddCategoryComponent} from "./pages/add-category/add-category.component";
import {ManageCategoryComponent} from "./pages/manage-category/manage-category.component";
import {ProductDetailsComponent} from "./pages/product-details/product-details.component";
import {CartComponent} from "./pages/cart/cart.component";
import {AddProductComponent} from "./pages/add-product/add-product.component";
import {AddMediaComponent} from "./pages/add-media/add-media.component";
import {ProductManagementComponent} from "./pages/product-management/product-management.component";

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
      },
      { path: 'add-product', component: AddProductComponent },
      { path: 'add-media/:productId', component: AddMediaComponent },
      { path: 'product-management', component: ProductManagementComponent }

    ]
  }
];
