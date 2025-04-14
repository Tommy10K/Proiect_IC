import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router } from '@angular/router';
import { DreamService } from '../services/dream.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dreamText: string = '';
  interpretation: string = '';

  constructor(private router: Router, private dreamService: DreamService) {}

  // Clears both the dream text and the interpretation.
  clearText(): void {
    this.dreamText = '';
    this.interpretation = '';
  }

  // Analyzes the dream text via the DreamService.
  analyzeDream(): void {
    if (!this.dreamText.trim()) {
      alert('Please enter a dream first!');
      return;
    }

    this.dreamService.interpretDream(this.dreamText).subscribe({
      next: (response: string) => {
        this.interpretation = response;
        // Prepend "Interpretation:" as a header inside the text box.
        this.dreamText = "Interpretation:\n\n" + response;
      },
      error: (err) => {
        this.interpretation = 'An error occurred while interpreting your dream.';
        this.dreamText = this.interpretation;
        console.error(err);
      }
    });
  }

  // Navigation for the side buttons.
  navigateToJournal(): void {
    this.router.navigate(['/journal']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }
}
