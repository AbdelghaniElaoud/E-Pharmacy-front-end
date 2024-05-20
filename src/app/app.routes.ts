import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LayoutComponent} from "./pages/layout/layout.component";
import {AddCategoryComponent} from "./pages/add-category/add-category.component";
import {ManageCategoryComponent} from "./pages/manage-category/manage-category.component";
import {ProductDetailsComponent} from "./pages/product-details/product-details.component";
import {CartComponent} from "./pages/cart/cart.component";
import {DeliveryManDashboardComponent} from "./pages/pages/delivery-man-dashboard/delivery-man-dashboard.component";
import {PharmacistDashboardComponent} from "./pages/pages/pharmacist-dashboard/pharmacist-dashboard.component";
import {AdminDashboardComponent} from "./pages/pages/admin-dashboard/admin-dashboard.component";
import {CustomerDashboardComponent} from "./pages/pages/customer-dashboard/customer-dashboard.component";

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
  },
  {
    path: 'customer',
    component: CustomerDashboardComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent
  },
  {
    path: 'pharmacist',
    component: PharmacistDashboardComponent
  },
  {
    path: 'delivery-man',
    component: DeliveryManDashboardComponent
  }
];
