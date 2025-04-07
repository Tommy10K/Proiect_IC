import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  dreamText: string = '';

  constructor(private router: Router) {}

  clearText(): void {
    this.dreamText = '';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
