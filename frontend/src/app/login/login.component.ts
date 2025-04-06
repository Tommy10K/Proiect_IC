import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSignupMode = false;  // Toggles between login and signup
  loginData = { username: '', password: '' }; // Holds login form data
  confirmPassword = '';  // For signup form

  constructor(private http: HttpClient) {}

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
  }

  login(): void {
    if (this.isSignupMode) {
      // Handle signup logic
      if (this.loginData.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Signing up with:', this.loginData.username, this.loginData.password);
      this.http.post('http://localhost:8080/api/auth/signup', this.loginData).subscribe({
        next: (response) => {
          console.log('Sign Up successful:', response);
          alert('Sign Up successful!');
        },
        error: (error) => {
          console.error('Sign Up failed:', error);
          alert('Sign Up failed. Please try again.');
        },
      });
    } else {
      // Handle login logic
      console.log('Logging in with:', this.loginData.username, this.loginData.password);
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
}
