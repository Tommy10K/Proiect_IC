import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dreamText: string = '';

  constructor(private router: Router) {}

  clearText(): void {
    this.dreamText = '';
  }

  navigateToJournal() {
    this.router.navigate(['/journal']);
  }

  navigateToStatistics() {
    this.router.navigate(['/statistics']);
  }
}