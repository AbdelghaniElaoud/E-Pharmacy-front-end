import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  imports: [
    NgForOf,
    NgClass
  ],
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];

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
}
