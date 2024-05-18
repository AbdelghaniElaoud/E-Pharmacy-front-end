import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CartService} from "../../service/cart-service/cart-service.service";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  cartItemCount: any;

  constructor(private cartService : CartService, private route: Router) {
    this.cartService.cart$.subscribe(cartMap => {
      this.cartItemCount = this.cartService.getCartLength();
    });
  }
  logOut() {
    localStorage.clear();
    this.route.navigateByUrl('/login');

  }
}
