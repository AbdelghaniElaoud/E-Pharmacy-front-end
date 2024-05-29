import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProfileService} from "../../service/profile/profile.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    NgIf
  ],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  profile: any;
  accountAgeDays: number | null = null;
  accountAgeHours: number | null = null;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.profileService.getProfile(userId).subscribe(
      data => {
        this.profile = data;
        this.calculateAccountAge(this.profile.createdAt);
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
}
