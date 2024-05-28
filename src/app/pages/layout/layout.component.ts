import {Component, OnInit} from '@angular/core';
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
export class LayoutComponent implements OnInit{
  cartItemCount: any;
  userId : number | undefined;

  constructor(private cartService : CartService, private route: Router) {
    this.cartService.cart$.subscribe(cartMap => {
      this.cartItemCount = this.cartService.getCartLength();
      this.userId = 0;
    });
  }

  ngOnInit(): void {
    this.getIdFromToken();
    }
  logOut() {
    localStorage.clear();
    this.route.navigateByUrl('/login');

  }

  getIdFromToken(){
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId =  payload.id;
    }
  }
}
