// src/app/statistics/statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ProfileService, ProfileMatchDTO } from '../services/profile.service';
import { AuthService }       from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [CommonModule]
})
export class StatisticsComponent implements OnInit {
  topMatch: ProfileMatchDTO | null = null;
  matches: ProfileMatchDTO[] = [];
  loading = true;

  constructor(
    private profileSvc: ProfileService,
    private authSvc:    AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authSvc.getUserId();
    if (userId === null) {
      this.loading = false;
      return;
    }

    this.profileSvc.getUserMatches(userId).subscribe({
      next: data => {
        // only keep matches > 30%
        this.matches = data.filter(m => (m.similarity * 100) > 30);
        if (this.matches.length > 0) {
          // service returns sorted desc, so first is highest
          this.topMatch = this.matches[0];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
