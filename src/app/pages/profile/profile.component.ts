import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import { ProfileService } from '../../service/profile/profile.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    FormsModule,
    NgIf
  ],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  profile: any;
  accountAgeDays: number | null = null;
  accountAgeHours: number | null = null;
  isEditing = false;
  editData = {
    id: null,
    firstName: '',
    lastName: '',
    email: ''
  };

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.profileService = new ProfileService();
  }

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.profileService.getProfile(userId).subscribe(
      data => {
        this.profile = data;
        this.calculateAccountAge(this.profile.createdAt);
        this.initializeEditData();
        console.log('Profile data loaded:', this.profile);
      },
      error => {
        console.error('Error fetching profile', error);
      }
    );
  }

  calculateAccountAge(createdAt: string): void {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    this.accountAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    this.accountAgeHours = Math.floor(diffTime / (1000 * 60 * 60));
  }

  initializeEditData(): void {
    if (this.profile) {
      this.editData.id = this.profile.id;
      this.editData.firstName = this.profile.firstName;
      this.editData.lastName = this.profile.lastName;
      this.editData.email = this.profile.email;
      console.log('Edit data initialized:', this.editData);
    }
  }

  editProfile(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  onSubmit(): void {
    console.log('Submitting form data:', this.editData);
    const url = 'http://localhost:8080/api/users/update-profile';
    const token = localStorage.getItem('token'); // Retrieve the token from storage

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(url, this.editData, { headers }).subscribe(
        response => {
          console.log('Profile update response:', response);
          this.profile.firstName = this.editData.firstName;
          this.profile.lastName = this.editData.lastName;
          this.profile.email = this.editData.email;
          this.isEditing = false;
        },
        error => {
          console.error('Error updating profile:', error);
        }
      );
    } else {
      console.error('No token found, user is not authenticated');
    }
  }
}
