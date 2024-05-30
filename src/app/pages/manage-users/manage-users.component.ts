import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  imports: [
    NgForOf,
    NgClass,
    FormsModule,
    FormsModule
  ],
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  roles: string[] = ['admin', 'delivery', 'pharmacist', 'customer']; // Add your roles here
  selectedRole: string = '';
  newUser: any = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'pharmacist',
    phone: '',
    address: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get('http://localhost:8080/api/users/non-admins', { headers }).subscribe(
        (response: any) => {
          this.users = response.content;
          this.filteredUsers = this.users; // Initially show all users
          console.log('Users data:', this.users);
        },
        error => {
          console.error('Error fetching users', error);
        }
      );
    } else {
      console.error('No token found, user is not authenticated');
    }
  }

  filterUsersByRole(role: string): void {
    this.selectedRole = role;
    if (role) {
      this.filteredUsers = this.users.filter(user => user.role === role);
    } else {
      this.filteredUsers = this.users;
    }
  }

  toggleUserStatus(user: any): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const url = `http://localhost:8080/api/users/${user.id}/activate`;

      this.http.post(url, {}, { headers }).subscribe(
        (response: any) => {
          console.log('User status updated:', response);
          user.status = (user.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
        },
        error => {
          console.error('Error updating user status', error);
        }
      );
    } else {
      console.error('No token found, user is not authenticated');
    }
  }

  editUser(user: any): void {
    // Implement edit user functionality
  }

  deleteUser(userId: number): void {
    // Implement delete user functionality
  }

  openModal(): void {
    const modal = document.getElementById('userModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('userModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  saveUser(): void {
    // Prepare the data to be sent
    const newUserPayload = {
      username: this.newUser.username,
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
      email: this.newUser.email,
      password: this.newUser.password,
      role: [this.newUser.role],
      phone: this.newUser.phone,
      address: this.newUser.address || '' // Ensure address is sent as an empty string if not provided
    };

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post('http://localhost:8080/api/auth/signup', newUserPayload, { headers }).subscribe(
        (response: any) => {
          console.log('User created:', response);
          this.fetchUsers(); // Refresh the user list
          this.closeModal(); // Close the modal after saving
        },
        error => {
          console.error('Error creating user', error);
        }
      );
    } else {
      console.error('No token found, user is not authenticated');
    }
  }
}
