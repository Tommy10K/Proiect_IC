import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { DreamService } from '../services/dream.service'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  dreamText: string = '';
  interpretation: string = '';

  constructor(private router: Router, private dreamService: DreamService) {}

  clearText(): void {
    this.dreamText = '';
    this.interpretation = '';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  analyzeDream(): void {
    if (!this.dreamText.trim()) {
      alert('Please enter a dream first!');
      return;
    }
    this.dreamService.interpretDream(this.dreamText).subscribe({
      next: (response: string) => {
        this.interpretation = response;
        // Prepend interpretation header inside the text box.
        this.dreamText = "Interpretation:\n\n" + response;
      },
      error: (err) => {
        this.interpretation = 'An error occurred while interpreting your dream.';
        this.dreamText = this.interpretation;
        console.error(err);
      }
    });
  }
}
