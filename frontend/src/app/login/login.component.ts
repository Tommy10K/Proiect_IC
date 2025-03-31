import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = { username: '', password: '' }; // Holds login form data

  constructor(private http: HttpClient) {}

  login(): void {
    this.http.post('http://localhost:8080/api/auth/login', this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert('Login successful!');
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
      },
    });
  }
}