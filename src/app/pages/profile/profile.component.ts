import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProfileService} from "../../service/profile/profile.service";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    DatePipe,
    NgIf
  ],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  profile: any;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.profileService.getProfile(userId).subscribe(
      data => {
        this.profile = data;
      },
      error => {
        console.error('Error fetching profile', error);
      }
    );
  }
}
