import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DreamService } from '../services/dream.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  dreamText = '';
  interpretation = '';

  constructor(private router: Router, private dreamService: DreamService) {}

  clearText() {
    this.dreamText = '';
    this.interpretation = '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  analyzeDream() {
    if (!this.dreamText.trim()) { alert('Please enter a dream first!'); return; }

   this.dreamService.interpretDream(this.dreamText).subscribe({
     next: res => {                                   // res e obiect, nu string
       this.interpretation = res.interpretation;
       this.dreamText = `Interpretation:\n\n${res.interpretation}`;
     },
     error: () => {
       this.interpretation = 'Server error';
     }
   });

  }
}
