import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DreamService } from '../services/dream.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],   // RouterOutlet scos
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dreamText = '';
  interpretation = '';

  constructor(private router: Router, private dreamService: DreamService) {}

  clearText() {
    this.dreamText = '';
    this.interpretation = '';
  }

  analyzeDream() {
    if (!this.dreamText.trim()) {
      alert('Please enter a dream first!');
      return;
    }

    this.dreamService.interpretDream(this.dreamText).subscribe({
      next: res => {
        this.interpretation = res.interpretation;
        // opţional: prepend interpretarea în textarea
        this.dreamText = `Interpretation:\n\n${res.interpretation}`;
      },
      error: () => {
        this.interpretation = 'An error occurred while interpreting your dream.';
        console.error('Dream AI error');
      }
    });
  }

  navigateToJournal()    { this.router.navigate(['/journal']); }
  navigateToStatistics() { this.router.navigate(['/statistics']); }
}
