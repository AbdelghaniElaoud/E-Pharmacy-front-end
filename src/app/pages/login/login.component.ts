import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
import { Login } from "../../model/Login";
import { jwtDecode } from 'jwt-decode';
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

interface User {
  sub: string;
  id: number;
  email: string;
  roles: { authority: string }[];
  active: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  LoginObj: Login;
  RegisterObj: any = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  };
  showModal: boolean = false;
  showForgotPasswordModal = false;
  forgotPasswordEmail = '';

  constructor(private http: HttpClient, private router: Router) {
    this.LoginObj = new Login();
  }

  onLogin() {
    this.http.post('http://localhost:8080/api/auth/signin', this.LoginObj).subscribe((res: any) => {
      if (res.success) {
        localStorage.setItem('token', res.accessToken);
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken: User = jwtDecode(token);
          if (decodedToken.active) {
            const userRole = decodedToken.roles[0].authority;
            switch(userRole) {
              case 'ROLE_CUSTOMER':
                this.router.navigate(['/dashboard']);
                break;
              case 'ROLE_DELIVERY_MAN':
                this.router.navigate(['/orders-delivery']);
                break;
              case 'ROLE_PHARMACIST':
                this.router.navigate(['/orders-pharmacist']);
                break;
              case 'ROLE_ADMIN':
                this.router.navigate(['/manage-users']);
                break;
              default:
                console.error('Unknown role');
                break;
            }
            /*this.router.navigate(['/dashboard']);*/
          } else {
            alert(res.message);
          }
        } else {
          console.error('Token not found');
        }
      } else {
        alert(res.message);
      }
    });
  }

  onRegister() {
    const registerPayload = {
      ...this.RegisterObj,
      role: ['customer']  // Default role for registration
    };

    console.log(registerPayload);

    this.http.post('http://localhost:8080/api/auth/signup', registerPayload).subscribe((res: any) => {
      if (res.success) {
        // alert('Registration successful! Please login.');
        this.closeRegisterModal();
      } else {
        alert(res.message);
      }
    });
  }

  openRegisterModal() {
    this.RegisterObj = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    };
    this.showModal = true;
  }

  closeRegisterModal() {
    this.showModal = false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }
  onForgotPassword() {
    const payload = {
      email: this.forgotPasswordEmail
    };

    this.http.post('http://localhost:8080/api/users/update-password-request', payload)
      .subscribe(
        (response: any) => {
          alert(response.content);
          this.closeForgotPasswordModal();
        },
        (error) => {
          alert('Error: ' + error.error.message);
        }
      );
  }
}
