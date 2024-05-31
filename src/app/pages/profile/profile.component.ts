import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileService } from '../../service/profile/profile.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: {
    link: string;
    altText: string;
  };
  createdAt: string;
  status: string;
  username: string;
}

interface ProfileUpdateResponse {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: {
    link: string;
    altText: string;
  };
}

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
  profile: UserProfile | null = null;
  accountAgeDays: number | null = null;
  accountAgeHours: number | null = null;
  isEditing = false;
  editData = {
    id: null as number | null,
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: null as File | null
  };

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.profileService.getProfile(userId).subscribe(
      (data: UserProfile) => {
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.editData.profilePhoto = file;
    }
  }

  onSubmit(): void {
    console.log('Submitting form data:', this.editData);
    const url = 'http://localhost:8080/api/users/update-profile';
    const token = localStorage.getItem('token'); // Retrieve the token from storage

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const formData: FormData = new FormData();
      if (this.editData.id !== null) {
        formData.append('id', this.editData.id.toString());
      }
      formData.append('firstName', this.editData.firstName);
      formData.append('lastName', this.editData.lastName);
      formData.append('email', this.editData.email);
      if (this.editData.profilePhoto) {
        formData.append('profilePhoto', this.editData.profilePhoto);
      }

      this.http.post<ProfileUpdateResponse>(url, formData, { headers }).subscribe(
        (response: ProfileUpdateResponse) => {
          console.log('Profile update response:', response);
          if (this.profile) {
            this.profile.firstName = response.firstName;
            this.profile.lastName = response.lastName;
            this.profile.email = response.email;
            if (response.profilePhoto) {
              this.profile.profilePhoto = response.profilePhoto;
            }
          }
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

  uploadProfilePhoto(): void {
    if (this.editData.profilePhoto && this.profile) {
      const url = `http://localhost:8080/api/users/${this.profile.id}/add-profile`;
      const token = localStorage.getItem('token'); // Retrieve the token from storage

      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const formData: FormData = new FormData();
        formData.append('image', this.editData.profilePhoto);

        this.http.post(url, formData, { headers }).subscribe(
          (response: any) => {
            console.log('Profile photo upload response:', response);
            if (this.profile) {
              this.profile.profilePhoto = response.profilePhoto;
              this.loadUserProfile(); // Refresh profile data
            }
          },
          error => {
            console.error('Error uploading profile photo:', error);
          }
        );
      } else {
        console.error('No token found, user is not authenticated');
      }
    }
  }
}
