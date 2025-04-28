import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router }      from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DreamService, InterpretResponse } from '../services/dream.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dreamTitle = '';          // <-- nou
  dreamText  = '';
  interpretation = '';

  constructor(
    private router: Router,
    private dreamService: DreamService
  ) {}

  /* ------ “Analyze Your Dream” ------------------ */
  analyzeDream(): void {
    if (!this.dreamText.trim()) {
      alert('Please enter a dream first!');
      return;
    }

    this.dreamService
        .interpretAndSave({
          title: this.dreamTitle.trim() || undefined,   // trimitem titlul
          description: this.dreamText
        })
        .subscribe({
          next: (res: InterpretResponse) => {
            this.interpretation = res.interpretation;
          },
          error: err => {
            console.error('Interpret&Save error', err);
            this.interpretation =
              'An error occurred while interpreting your dream.';
          }
        });
  }

  /* ------ “Analyze Another Dream” --------------- */
  clearText(): void {
    this.dreamTitle = '';
    this.dreamText  = '';
    this.interpretation = '';
  }

  /* --------- navigaţia laterală ----------------- */
  navigateToJournal()    { this.router.navigate(['/journal']); }
  navigateToStatistics() { this.router.navigate(['/statistics']); }
}
