import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {Login} from "../../model/Login";
import { jwtDecode } from 'jwt-decode';
import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";

interface User {
  sub: string;
  id: number;
  email: string;
  roles: { authority: string }[];
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  LoginObj : Login;

  constructor(private http : HttpClient, private router:Router) {
    this.LoginObj = new Login();
  }


  onLogin() {
    debugger;
    this.http.post('http://localhost:8080/api/auth/signin', this.LoginObj).subscribe((res: any) => {
      if (res.success) {
        localStorage.setItem('token', res.accessToken);
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken: User = jwtDecode(token);
          const userRole = decodedToken.roles[0].authority;
          switch (userRole) {
            case 'ROLE_CUSTOMER':
              this.router.navigate(['/customer']);
              break;
            case 'ROLE_ADMIN':
              this.router.navigate(['/admin']);
              break;
            case 'ROLE_PHARMACIST':
              this.router.navigate(['/pharmacist']);
              break;
            case 'ROLE_DELIVERY_MAN':
              this.router.navigate(['/delivery-man']);
              break;
            default:
              this.router.navigate(['/login']);
              break;
          }
        } else {
          console.error('Token not found');
        }
      } else {
        alert(res.message);
      }
    });
  }
}

