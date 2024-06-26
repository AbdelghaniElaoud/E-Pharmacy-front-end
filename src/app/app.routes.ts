import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { ManageCategoryComponent } from './pages/manage-category/manage-category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AddMediaComponent } from './pages/add-media/add-media.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { OrdersPharmacistComponent } from './pages/orders-pharmacist/orders-pharmacist.component';
import { OrdersDeliveryComponent } from './pages/orders-delivery/orders-delivery.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { authGuard } from './service/auth/auth.guard';

export const routes: Routes = [
  {
    path: '', redirectTo: 'landing-page', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: LandingPageComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]
      },
      {
        path: 'create-category', component: AddCategoryComponent, canActivate: [authGuard]
      },
      {
        path: 'category', component: ManageCategoryComponent, canActivate: [authGuard]
      },
      {
        path: 'product-details/:id', component: ProductDetailsComponent, canActivate: [authGuard]
      },
      {
        path: 'cart', component: CartComponent, canActivate: [authGuard]
      },
      {
        path: 'add-product', component: AddProductComponent, canActivate: [authGuard]
      },
      {
        path: 'add-media/:productId', component: AddMediaComponent, canActivate: [authGuard]
      },
      {
        path: 'product-management', component: ProductManagementComponent, canActivate: [authGuard]
      },
      {
        path: 'orders-pharmacist', component: OrdersPharmacistComponent, canActivate: [authGuard]
      },
      {
        path: 'orders-delivery', component: OrdersDeliveryComponent, canActivate: [authGuard]
      },
      {
        path: 'profile/:userId', component: ProfileComponent, canActivate: [authGuard]
      },
      {
        path: 'manage-users', component: ManageUsersComponent, canActivate: [authGuard]
      },
      {
        path: 'orders-history', component: OrderHistoryComponent, canActivate: [authGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
