import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { DreamService, InterpretResponse } from '../services/dream.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dreamTitle     = '';
  dreamText      = '';
  interpretation = '';
  showTitle = false;

  constructor(
    private router: Router,
    private dreamService: DreamService,
    private auth: AuthService
  ) {}

  analyzeDream(): void {
    if (!this.dreamText.trim()) {
      alert('Please enter a dream first!');
      return;
    }

    this.showTitle = false;

    const payload = {
      title: this.dreamTitle.trim() || undefined,
      description: this.dreamText
    };

    this.dreamService.interpretAndSave(payload)
      .subscribe({
        next: (res: InterpretResponse) => {
          this.interpretation = res.interpretation;
          this.dreamText = `Interpretation:\n\n${res.interpretation}`;
        },
        error: err => {
          console.error('Interpret&Save error', err);
          this.interpretation =
            'An error occurred while interpreting your dream.';
        }
      });
  }

  clearText(): void {
    this.dreamTitle     = '';   // ← clear title too
    this.dreamText      = '';
    this.interpretation = '';
    this.showTitle = false;
  }

  navigateToJournal()    { this.router.navigate(['/journal']); }
  navigateToStatistics() { this.router.navigate(['/statistics']); }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
navigateToInfo(): void {
    this.router.navigate(['/info']);
  }
}
